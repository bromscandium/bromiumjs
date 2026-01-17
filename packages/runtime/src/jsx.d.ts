// JSX Type Declarations for BromiumJS

import { VNode } from './vnode.js';

type Child = VNode | string | number | boolean | null | undefined;
type Children = Child | Child[];

interface HTMLAttributes<T = Element> {
  // Standard HTML attributes
  className?: string;
  id?: string;
  style?: string | Record<string, string | number>;
  title?: string;
  tabIndex?: number;
  role?: string;
  hidden?: boolean;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  'data-testid'?: string;

  // Event handlers
  onClick?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseOut?: (e: MouseEvent) => void;

  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
  onKeyPress?: (e: KeyboardEvent) => void;

  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;

  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
  onSubmit?: (e: SubmitEvent) => void;

  onScroll?: (e: Event) => void;
  onWheel?: (e: WheelEvent) => void;

  onDrag?: (e: DragEvent) => void;
  onDragStart?: (e: DragEvent) => void;
  onDragEnd?: (e: DragEvent) => void;
  onDragEnter?: (e: DragEvent) => void;
  onDragLeave?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;

  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
  onTouchCancel?: (e: TouchEvent) => void;

  onAnimationStart?: (e: AnimationEvent) => void;
  onAnimationEnd?: (e: AnimationEvent) => void;
  onAnimationIteration?: (e: AnimationEvent) => void;

  onTransitionEnd?: (e: TransitionEvent) => void;

  onLoad?: (e: Event) => void;
  onError?: (e: Event) => void;

  // Children
  children?: Children;

  // Allow any other attribute
  [key: string]: any;
}

interface InputHTMLAttributes<T = HTMLInputElement> extends HTMLAttributes<T> {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'checkbox' | 'radio' | 'file' | 'hidden' | 'submit' | 'reset' | 'button' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'color' | 'range';
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  name?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  multiple?: boolean;
  accept?: string;
  maxLength?: number;
  minLength?: number;
}

interface TextareaHTMLAttributes<T = HTMLTextAreaElement> extends HTMLAttributes<T> {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  name?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  wrap?: 'hard' | 'soft' | 'off';
}

interface SelectHTMLAttributes<T = HTMLSelectElement> extends HTMLAttributes<T> {
  value?: string | string[];
  defaultValue?: string | string[];
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  name?: string;
  multiple?: boolean;
  size?: number;
}

interface ButtonHTMLAttributes<T = HTMLButtonElement> extends HTMLAttributes<T> {
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  name?: string;
  value?: string;
  autoFocus?: boolean;
}

interface AnchorHTMLAttributes<T = HTMLAnchorElement> extends HTMLAttributes<T> {
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  download?: boolean | string;
}

interface ImgHTMLAttributes<T = HTMLImageElement> extends HTMLAttributes<T> {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  decoding?: 'sync' | 'async' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface FormHTMLAttributes<T = HTMLFormElement> extends HTMLAttributes<T> {
  action?: string;
  method?: 'get' | 'post';
  encType?: string;
  target?: string;
  autoComplete?: 'on' | 'off';
  noValidate?: boolean;
}

interface LabelHTMLAttributes<T = HTMLLabelElement> extends HTMLAttributes<T> {
  htmlFor?: string;
}

interface OptionHTMLAttributes<T = HTMLOptionElement> extends HTMLAttributes<T> {
  value?: string | number;
  disabled?: boolean;
  selected?: boolean;
  label?: string;
}

interface SVGAttributes extends HTMLAttributes {
  viewBox?: string;
  xmlns?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  d?: string;
  cx?: number | string;
  cy?: number | string;
  r?: number | string;
  x?: number | string;
  y?: number | string;
  x1?: number | string;
  y1?: number | string;
  x2?: number | string;
  y2?: number | string;
  rx?: number | string;
  ry?: number | string;
  points?: string;
  transform?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  fontFamily?: string;
  fontWeight?: string | number;
  fontSize?: number | string;
}

declare global {
  namespace JSX {
    interface Element extends VNode {}

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes {
      key?: string | number | null;
    }

    interface IntrinsicElements {
      // Document metadata
      head: HTMLAttributes;
      title: HTMLAttributes;
      base: HTMLAttributes;
      link: HTMLAttributes & { href?: string; rel?: string; type?: string };
      meta: HTMLAttributes & { name?: string; content?: string; charset?: string };
      style: HTMLAttributes & { type?: string };

      // Sectioning root
      body: HTMLAttributes;

      // Content sectioning
      address: HTMLAttributes;
      article: HTMLAttributes;
      aside: HTMLAttributes;
      footer: HTMLAttributes;
      header: HTMLAttributes;
      h1: HTMLAttributes;
      h2: HTMLAttributes;
      h3: HTMLAttributes;
      h4: HTMLAttributes;
      h5: HTMLAttributes;
      h6: HTMLAttributes;
      main: HTMLAttributes;
      nav: HTMLAttributes;
      section: HTMLAttributes;

      // Text content
      blockquote: HTMLAttributes & { cite?: string };
      dd: HTMLAttributes;
      div: HTMLAttributes;
      dl: HTMLAttributes;
      dt: HTMLAttributes;
      figcaption: HTMLAttributes;
      figure: HTMLAttributes;
      hr: HTMLAttributes;
      li: HTMLAttributes & { value?: number };
      ol: HTMLAttributes & { reversed?: boolean; start?: number; type?: '1' | 'a' | 'A' | 'i' | 'I' };
      p: HTMLAttributes;
      pre: HTMLAttributes;
      ul: HTMLAttributes;

      // Inline text semantics
      a: AnchorHTMLAttributes;
      abbr: HTMLAttributes;
      b: HTMLAttributes;
      bdi: HTMLAttributes;
      bdo: HTMLAttributes & { dir?: 'ltr' | 'rtl' };
      br: HTMLAttributes;
      cite: HTMLAttributes;
      code: HTMLAttributes;
      data: HTMLAttributes & { value?: string };
      dfn: HTMLAttributes;
      em: HTMLAttributes;
      i: HTMLAttributes;
      kbd: HTMLAttributes;
      mark: HTMLAttributes;
      q: HTMLAttributes & { cite?: string };
      rp: HTMLAttributes;
      rt: HTMLAttributes;
      ruby: HTMLAttributes;
      s: HTMLAttributes;
      samp: HTMLAttributes;
      small: HTMLAttributes;
      span: HTMLAttributes;
      strong: HTMLAttributes;
      sub: HTMLAttributes;
      sup: HTMLAttributes;
      time: HTMLAttributes & { dateTime?: string };
      u: HTMLAttributes;
      var: HTMLAttributes;
      wbr: HTMLAttributes;

      // Image and multimedia
      area: HTMLAttributes & { alt?: string; coords?: string; download?: boolean | string; href?: string; shape?: string; target?: string };
      audio: HTMLAttributes & { src?: string; autoPlay?: boolean; controls?: boolean; loop?: boolean; muted?: boolean; preload?: 'none' | 'metadata' | 'auto' };
      img: ImgHTMLAttributes;
      map: HTMLAttributes & { name?: string };
      track: HTMLAttributes & { default?: boolean; kind?: string; label?: string; src?: string; srcLang?: string };
      video: HTMLAttributes & { src?: string; poster?: string; autoPlay?: boolean; controls?: boolean; loop?: boolean; muted?: boolean; playsInline?: boolean; preload?: 'none' | 'metadata' | 'auto'; width?: number | string; height?: number | string };

      // Embedded content
      embed: HTMLAttributes & { src?: string; type?: string; width?: number | string; height?: number | string };
      iframe: HTMLAttributes & { src?: string; srcdoc?: string; name?: string; sandbox?: string; allow?: string; allowFullScreen?: boolean; width?: number | string; height?: number | string; loading?: 'lazy' | 'eager' };
      object: HTMLAttributes & { data?: string; type?: string; name?: string; width?: number | string; height?: number | string };
      picture: HTMLAttributes;
      source: HTMLAttributes & { src?: string; srcSet?: string; media?: string; sizes?: string; type?: string };

      // Scripting
      canvas: HTMLAttributes & { width?: number | string; height?: number | string };
      noscript: HTMLAttributes;
      script: HTMLAttributes & { src?: string; type?: string; async?: boolean; defer?: boolean; crossOrigin?: 'anonymous' | 'use-credentials' };

      // Demarcating edits
      del: HTMLAttributes & { cite?: string; dateTime?: string };
      ins: HTMLAttributes & { cite?: string; dateTime?: string };

      // Table content
      caption: HTMLAttributes;
      col: HTMLAttributes & { span?: number };
      colgroup: HTMLAttributes & { span?: number };
      table: HTMLAttributes;
      tbody: HTMLAttributes;
      td: HTMLAttributes & { colSpan?: number; rowSpan?: number; headers?: string };
      tfoot: HTMLAttributes;
      th: HTMLAttributes & { colSpan?: number; rowSpan?: number; headers?: string; scope?: 'row' | 'col' | 'rowgroup' | 'colgroup' };
      thead: HTMLAttributes;
      tr: HTMLAttributes;

      // Forms
      button: ButtonHTMLAttributes;
      datalist: HTMLAttributes;
      fieldset: HTMLAttributes & { disabled?: boolean; name?: string };
      form: FormHTMLAttributes;
      input: InputHTMLAttributes;
      label: LabelHTMLAttributes;
      legend: HTMLAttributes;
      meter: HTMLAttributes & { value?: number; min?: number; max?: number; low?: number; high?: number; optimum?: number };
      optgroup: HTMLAttributes & { disabled?: boolean; label?: string };
      option: OptionHTMLAttributes;
      output: HTMLAttributes & { htmlFor?: string; name?: string };
      progress: HTMLAttributes & { value?: number; max?: number };
      select: SelectHTMLAttributes;
      textarea: TextareaHTMLAttributes;

      // Interactive elements
      details: HTMLAttributes & { open?: boolean };
      dialog: HTMLAttributes & { open?: boolean };
      summary: HTMLAttributes;

      // Web Components
      slot: HTMLAttributes & { name?: string };
      template: HTMLAttributes;

      // SVG elements
      svg: SVGAttributes;
      path: SVGAttributes;
      circle: SVGAttributes;
      rect: SVGAttributes;
      line: SVGAttributes;
      polyline: SVGAttributes;
      polygon: SVGAttributes;
      text: SVGAttributes;
      g: SVGAttributes;
      defs: SVGAttributes;
      use: SVGAttributes & { href?: string; xlinkHref?: string };
      clipPath: SVGAttributes;
      mask: SVGAttributes;
      pattern: SVGAttributes;
      linearGradient: SVGAttributes;
      radialGradient: SVGAttributes;
      stop: SVGAttributes & { offset?: string; stopColor?: string; stopOpacity?: number | string };
    }
  }
}

export {};
