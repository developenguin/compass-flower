class Circle {

  constructor(props) {
    this.x = props.x;
    this.y = props.y;
    this.r = props.r;
  }

  isSameAs(circle = {}) {

    const thisX = parseFloat(this.x.toFixed(8)),
      thisY = parseFloat(this.y.toFixed(8)),
      otherX = parseFloat(circle.x.toFixed(8)),
      otherY = parseFloat(circle.y.toFixed(8));

    return thisX === otherX && thisY === otherY && this.r === circle.r

  }

  hasPointInside(point = { x: null, y: null }) {

    const center = this.getCenter();
    const radiusSquared = Math.pow(this.getRadius(), 2);
    const distanceSquared = Math.pow(center.x - point.x, 2) + Math.pow(center.y - point.y, 2);

    return distanceSquared < radiusSquared;

  }

  getCenter() {
    return {
      x: this.x,
      y: this.y
    }
  }

  getRadius() {
    return this.r;
  }

}
