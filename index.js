/* global AFRAME THREE */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Curve component for A-Frame to deal with spline curves
 */
var zAxis = new THREE.Vector3(0, 0, 1);
var degToRad = THREE.Math.degToRad;

AFRAME.registerComponent('curve-point', {

    //dependencies: ['position'],

    schema: {},

    init: function () {
        this.el.addEventListener("componentchanged", this.changeHandler.bind(this));
        this.el.emit("curve-point-change");
    },

    changeHandler: function (event) {
        if (event.detail.name == "position") {
            this.el.emit("curve-point-change");
        }
    }

});

AFRAME.registerComponent('curve', {

    //dependencies: ['curve-point'],

    schema: {
        type: {
            type: 'string',
            default: 'CatmullRom',
            oneOf: ['CatmullRom', 'CubicBezier', 'QuadraticBezier', 'Line']
        },
        closed: {
            type: 'boolean',
            default: false
        },
        tension: {
            type: 'number',
            default: 0.5
        }
    },

    init: function () {
        this.pathPoints = null;
        this.curve = null;

        this.el.addEventListener("curve-point-change", this.update.bind(this));
    },

    update: function (oldData) {

        this.points = Array.from(this.el.querySelectorAll("a-curve-point, [curve-point]"));

        if (this.points.length <= 1) {
            console.warn("At least 2 curve-points needed to draw a curve");
            this.curve = null;
        } else {
            // Get Array of Positions from Curve-Points
            var pointsArray = this.points.map(function (point) {

                if (point.x !== undefined && point.y !== undefined && point.z !== undefined) {
                    return point;
                }

                // return point.object3D.getWorldPosition();
                return point.object3D.position;
            });

            // Update the Curve if either the Curve-Points or other Properties changed
            if (!AFRAME.utils.deepEqual(pointsArray, this.pathPoints) || (oldData !== 'CustomEvent' && !AFRAME.utils.deepEqual(this.data, oldData))) {
                this.curve = null;

                this.pathPoints = pointsArray;

                // Create Curve
                switch (this.data.type) {
                    case 'CubicBezier':
                        if (this.pathPoints.length != 4) {
                            throw new Error('The Three constructor of type CubicBezierCurve3 requires 4 points');
                        }
                        this.curve = new THREE.CubicBezierCurve3(this.pathPoints[0], this.pathPoints[1], this.pathPoints[2], this.pathPoints[3]);
                        break;
                    case 'QuadraticBezier':
                        if (this.pathPoints.length != 3) {
                            throw new Error('The Three constructor of type QuadraticBezierCurve3 requires 3 points');
                        }
                        this.curve = new THREE.QuadraticBezierCurve3(this.pathPoints[0], this.pathPoints[1], this.pathPoints[2]);
                        break;
                    case 'Line':
                        if (this.pathPoints.length != 2) {
                            throw new Error('The Three constructor of type LineCurve3 requires 2 points');
                        }
                        this.curve = new THREE.LineCurve3(this.pathPoints[0], this.pathPoints[1]);
                        break;
                    case 'CatmullRom':
                        this.curve = new THREE.CatmullRomCurve3(this.pathPoints, this.data.closed, 'catmullrom', this.data.tension);
                        break;
                    case 'Spline':
                        this.curve = new THREE.SplineCurve(this.pathPoints);
                        break;
                    default:
                        throw new Error('No Three constructor of type (case sensitive): ' + this.data.type + 'Curve3');
                }

                this.curve.closed = this.data.closed;

                this.el.emit('curve-updated');
            }
        }

    },

    remove: function () {
        this.el.removeEventListener("curve-point-change", this.update.bind(this));
    },

    closestPointInLocalSpace: function closestPoint(point, resolution, testPoint, currentRes) {
        if (!this.curve) throw Error('Curve not instantiated yet.');
        resolution = resolution || 0.1 / this.curve.getLength();
        currentRes = currentRes || 0.5;
        testPoint = testPoint || 0.5;
        currentRes /= 2;
        var aTest = testPoint + currentRes;
        var bTest = testPoint - currentRes;
        var a = this.curve.getPointAt(aTest);
        var b = this.curve.getPointAt(bTest);
        var aDistance = a.distanceTo(point);
        var bDistance = b.distanceTo(point);
        var aSmaller = aDistance < bDistance;
        if (currentRes < resolution) {

            var tangent = this.curve.getTangentAt(aSmaller ? aTest : bTest);
            if (currentRes < resolution) return {
                result: aSmaller ? aTest : bTest,
                location: aSmaller ? a : b,
                distance: aSmaller ? aDistance : bDistance,
                normal: normalFromTangent(tangent),
                tangent: tangent
            };
        }
        if (aDistance < bDistance) {
            return this.closestPointInLocalSpace(point, resolution, aTest, currentRes);
        } else {
            return this.closestPointInLocalSpace(point, resolution, bTest, currentRes);
        }
    }
});


var tempQuaternion = new THREE.Quaternion();

function normalFromTangent(tangent) {
    var lineEnd = new THREE.Vector3(0, 1, 0);
    tempQuaternion.setFromUnitVectors(zAxis, tangent);
    lineEnd.applyQuaternion(tempQuaternion);
    return lineEnd;
}


AFRAME.registerComponent('draw-curve', {

    //dependencies: ['curve', 'material'],

    schema: {
        curve: {type: 'selector'},
        color: {type: 'color', default: '#ff00ff'}
    },

    init: function () {
        this.data.curve.addEventListener('curve-updated', this.update.bind(this));
    },

    update: function () {
        if (this.data.curve) {
            this.curve = this.data.curve.components.curve;
        }

        if (this.curve && this.curve.curve) {
            var lineGeometry = new THREE.BufferGeometry().setFromPoints(this.curve.curve.getPoints(this.curve.curve.getPoints().length * 10));
            var mesh = this.el.getOrCreateObject3D('mesh', THREE.Line);
            var lineMaterial = new THREE.LineBasicMaterial({
                color: this.data.color,
                linewidth: 1,
            });

            this.el.setObject3D('mesh', new THREE.Line(lineGeometry, lineMaterial));
        }
    },

    remove: function () {
        this.data.curve.removeEventListener('curve-updated', this.update.bind(this));
        this.el.getObject3D('mesh').geometry = new THREE.BufferGeometry();
    }

});

AFRAME.registerPrimitive('a-draw-curve', {
    defaultComponents: {
        'draw-curve': {},
    },
    mappings: {
        curveref: 'draw-curve.curve',
        color: 'draw-curve.color'
    }
});

AFRAME.registerPrimitive('a-curve-point', {
    defaultComponents: {
        'curve-point': {},
    },
    mappings: {}
});

AFRAME.registerPrimitive('a-curve', {
    defaultComponents: {
        'curve': {}
    },

    mappings: {
        type: 'curve.type',
        closed: 'curve.closed',
        tension: 'curve.tension'
    }
});

AFRAME.registerComponent('follow-path', {
    schema: {
        curve: {default: 'a-curve'}, // css selector
        incrementBy: {default: 0.01},
        throttleTo: {default: 100},
    },
    init() {
        this.tick = AFRAME.utils.throttleTick(this.tick, this.data.throttleTo, this);   
        this.curve = document.querySelector(this.data.curve);
        console.log(this.curve);
    },
    currentPercent: 0,
    newPos: {}, // better garbage handling
    tick() {
        this.currentPercent = this.currentPercent > (1 - this.data.incrementBy) ? 0 : this.currentPercent + this.data.incrementBy;
        this.newPos = this.curve.components.curve.curve.getPoint(this.currentPercent);
        this.el.setAttribute('position', this.newPos);        
    },
})
