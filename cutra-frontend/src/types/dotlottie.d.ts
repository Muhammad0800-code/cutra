declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-wc': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        speed?: string;
        autoplay?: boolean;
        loop?: boolean;
      },
      HTMLElement
    >;
  }
}
