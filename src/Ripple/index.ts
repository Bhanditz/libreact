import {Component, Children, cloneElement} from 'react';
import rule from 'freestyler/lib/rule';
import {h, noop} from '../util';

const className = rule({
  bdrad: '50%',
  h: '100px',
  w: '100px',
  pos: 'absolute',
  transform: 'scale(0)',
  op: 1,
  pointerEvents: 'none',
  '@keyframes libreact-ripple': {
    '100%': {
       transform: 'scale(12)',
       op: 0
    }
  }
});

export interface IRippleProps {
  color?: string;
  ms?: number;
}

export interface IRippleState {
  x: number;
  y: number;
}

export class Ripple extends Component<IRippleProps, IRippleState> {
  static defaultProps = {
    color: 'rgba(0,0,0,.2)',
    ms: 400
  };

  state: IRippleState = {
    x: 0,
    y: 0
  };

  el: HTMLElement = null;
  elRipple: HTMLDivElement = null;

  ref = (originalRef) => (el) => {
    this.el = el;
    (originalRef || noop)(el);
  };

  refRipple = (el) => {
    this.elRipple = el;
  };

  onMouseDown = (originalMouseDown) => (event) => {
    if (!this.elRipple) {
      return;
    }

    const {left, top} = this.el.getBoundingClientRect();
    const posX = left + window.scrollX;
    const posY = top + window.scrollY;
    const elX = event.pageX - posX;
    const elY = event.pageY - posY;
    const style = this.elRipple.style;

    style.removeProperty('animation');
    style.top = (elY - 50) + 'px';
    style.left = (elX - 50) + 'px';
    setTimeout(() => {
      style.setProperty('animation', `libreact-ripple ${this.props.ms}ms linear`);
    }, 35);

    (originalMouseDown || noop)(event);
  };

  render () {
    const {children, color} = this.props;
    const element = Children.only(children);
    const ripple = h('div', {
      className,
      style: {
        background: color,
      },
      ref: this.refRipple
    });

    let style = element.props.style || {};

    style = Object.assign({}, style, {
      overflow: 'hidden',
      position: 'relative'
    });

    const innerChildren = Children.toArray(element.props.children);

    innerChildren.push(ripple);

    return cloneElement(element, {
      ...element.props,
      style,
      ref: this.ref(element.props.ref),
      onMouseDown: this.onMouseDown(element.props.onMouseDown)
    }, ...innerChildren);
  }
}
