Another necro-component pulled into service - working with a-Frame 1.3.0.

* Demo: https://follow-path.glitch.me/
* Remix it: https://glitch.com/edit/#!/remix/follow-path

Note: There is also another fork that was more recently updated than the fork I based mine off of by the prolific Ada, though it seems to be a more significant set of changes. It may suite you to check it out [here](https://github.com/AdaRoseCannon/aframe-curves).

## aframe-curve-component

A Curve component to draw curves in A-Frame. The component consists of multiple components:

* curve: Draws a certain type of a curve and consists of multiple "curve-points"
* curve-point: Defines the curve based on it's position. Multiple entities are added as children of the curve-entity.
* draw-curve: Add's a Mesh to the curve to visualize it
* clone-along-curve: Clones an Entity along the curve (e.g. to build a race track based on track parts)
* **follow-path**: Animates an entity following a curved path

For [A-Frame](https://aframe.io).

Credits: Initial concept and development has been done by [AdaRoseEdwards](https://github.com/SamsungInternet/a-frame-components/blob/master/dist/curve.js). Revived to get working with Aframe 1.2.0-1.3.0 by [David F Stein](https://github.com/davidfstein/aframe-curve-component). Follow-path added by [kyle baker](kyle.su).

### API (curve)

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| type         | Type of the Curve to draw. One ff: 'CatmullRom', 'Spline', 'CubicBezier', 'QuadraticBezier', 'Line'            | CatmullRom              |
| closed         | Whether or not the curve should be drawn closed (connect the end and start point automatically)           | false              |

### API (curve-point)

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### API (draw-curve)

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| curve         | A Selector to identify the corresponding curve            | ''              |

### API (clone-along-curve)

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| curve         | A Selector to identify the corresponding curve            | ''              |
| spacing         | Spacing between the cloned entities in Meters            | 1              |
| rotation         | Rotation of the cloned Entities            | '0 0 0'              |
| scale         | Scale of the cloned entities            | '1 1 1'              |

### Installation

#### Browser

Dist file is out of date, just use index.js file for now, minify yourself if needed. Will ideally update and publish better version later.
