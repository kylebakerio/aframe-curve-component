Another necro-component pulled into service - confirmed working with a-Frame 1.3.0.

* Demo: https://follow-path.glitch.me/
* Remix it: https://glitch.com/edit/#!/remix/follow-path

Note: There is also another fork that was more recently updated than the fork I based mine off of by the prolific Ada, though it seems to be a more significant set of changes. It may suite you to check it out [here](https://github.com/AdaRoseCannon/aframe-curves).

## aframe-curve-component

A Curve component to draw curves in A-Frame. The component consists of multiple components:

* curve: Draws a certain type of a curve and consists of multiple "curve-points"
* curve-point: Defines the curve based on it's position. Multiple entities are added as children of the curve-entity.
* draw-curve: Add's a Mesh to the curve to visualize it
* clone-along-curve: Clones an Entity along the curve (e.g. to build a race track based on track parts)
* **follow-path (new)**: Animates an entity following a curved path

For [A-Frame](https://aframe.io).

Credits: Initial concept and development has been done by [AdaRoseEdwards](https://github.com/SamsungInternet/a-frame-components/blob/master/dist/curve.js). Then forked by protyze. Revived to get working with Aframe 1.2.0-1.3.0 by [David F Stein](https://github.com/davidfstein/aframe-curve-component). Follow-path added by [kyle baker](kyle.su).

### Full example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script src="components/aframe-curve/index.js"></script>
  </head>
  <body>
    <a-scene>      
      <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      
      <!-- Define the curve -->
      <a-curve id="track1">
        <a-curve-point position="0 1.25 -5"></a-curve-point>
        <a-curve-point position="3 1.25 -5"></a-curve-point>
        <a-curve-point position="3 1.25 -7.5"></a-curve-point>
        <a-curve-point position="-2 3.25 -7.5"></a-curve-point>
        <a-curve-point position="-2 7.25 -7.5"></a-curve-point>
        <a-curve-point position="0 1.25 -5"></a-curve-point>
      </a-curve>
    
      <!-- Draw the curve -->
      <a-draw-curve curveref="#track1" color="#0000ff"></a-draw-curve>
      
      <!-- Follow the curve -->
      <a-sphere follow-path="incrementBy:0.01; throttleTo:30" position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
    </a-scene>
  </body>
</html>

```

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


### API (follow-path)

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| curve         | A Selector to identify the corresponding curve; default works if there is only one curve in scene            | 'a-curve'              |
| incrementBy         | what percent of path to progress by each update            | 0.01              |
| throttleTo         | throttle rate; how many milliseconds between each update            | 100              |

### Installation

Just add index.js and reference it as needed like any other standard aframe component.

#### Browser

**Dist file is out of date, just use index.js file for now, minify yourself if needed. Will ideally update and publish later.**
