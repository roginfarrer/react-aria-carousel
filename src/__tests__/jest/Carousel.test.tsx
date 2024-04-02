import React, {useState} from 'react';
import {configure, render, screen, fireEvent} from '@root/test-utils';
import Carousel, {CarouselRef} from '../../Carousel';

configure({testIdAttribute: 'data-enzyme-id'});

describe('Carousel', () => {
  it('has expected forwarded ref interface', () => {
    let _instance: CarouselRef;
    render(
      <Carousel
        ref={(x) => {
          if (x) _instance = x;
        }}
        aria-label="pizza"
      >
        <Carousel.Scroller>
          <Carousel.Item>hi</Carousel.Item>
        </Carousel.Scroller>
      </Carousel>
    );
    const instance = _instance!;
    expect(typeof instance.scrollTo).toBe('function');
    expect(typeof instance.scrollToNextPage).toBe('function');
    expect(typeof instance.scrollIntoView).toBe('function');
    expect(typeof instance.scrollToPreviousPage).toBe('function');
    expect(typeof instance.refresh).toBe('function');
    expect(instance.element).toBe(screen.getByLabelText('pizza'));
  });
});

describe('Carousel.Scroller', () => {
  it('throws an error if not used within a Carousel', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() =>
      render(
        <Carousel.Scroller>
          <div>children</div>
        </Carousel.Scroller>
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase]: Carousel component missing provider"`
    );
    consoleError.mockRestore();
  });

  it('exposes access to refs', () => {
    const slider = jest.fn();
    const item = jest.fn();
    function Comp() {
      return (
        <Carousel aria-label="Test">
          <Carousel.Scroller ref={slider} testIds={{enzyme: 'slider'}}>
            <Carousel.Item ref={item} testIds={{enzyme: 'item'}} />
          </Carousel.Scroller>
        </Carousel>
      );
    }

    render(<Comp />);

    expect(slider).toHaveBeenCalledWith(screen.getByTestId('slider'));
    expect(item).toHaveBeenCalledWith(screen.getByTestId('item'));
  });

  it('throws an error if an invalid spaceBetweenItems is provided', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() =>
      render(
        <Carousel aria-label="Test">
          {/* @ts-expect-error */}
          <Carousel.Scroller spaceBetweenItems={50} />
        </Carousel>
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel]: spaceBetweenItems must be a valid CSS <length-percentage> value. Received: 50"`
    );
    consoleError.mockRestore();
  });

  describe('Carousel.Item', () => {
    it('throws an error if not used within a Carousel', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      expect(() =>
        render(<Carousel.Item />)
      ).toThrowErrorMatchingInlineSnapshot(
        `"[Homebase]: Carousel component missing provider"`
      );
      consoleError.mockRestore();
    });
  });

  describe('Carousel.Nav', () => {
    it('renders with the appropriate a11y attributes', () => {
      const slides = [1, 2, 3].map((num) => ({id: `${num}`}));
      function Comp() {
        const [activePageIndex, setActivePageIndex] = useState(0);
        return (
          <Carousel
            items={slides}
            onActivePageIndexChange={setActivePageIndex}
            aria-label="Hello"
          >
            <Carousel.Scroller>
              {(s: typeof slides[number], i) => (
                <Carousel.Item testIds={{enzyme: `slide-${i}`}}>
                  {s.id}
                </Carousel.Item>
              )}
            </Carousel.Scroller>
            <Carousel.Nav testIds={{enzyme: 'nav'}}>
              {(_, i) => (
                <Carousel.NavItem testIds={{enzyme: `navitem-${i}`}}>
                  {activePageIndex === i ? 'active' : 'not selected'}
                </Carousel.NavItem>
              )}
            </Carousel.Nav>
          </Carousel>
        );
      }

      render(<Comp />);

      expect(screen.queryByRole('tablist')).toEqual(screen.getByTestId('nav'));

      const navItems = screen.getAllByRole('tab');
      const firstItem = navItems[0];
      expect(firstItem).toHaveAttribute(
        'aria-controls',
        screen.getByTestId(`slide-0`).id
      );
      expect(firstItem).toHaveAttribute(
        'aria-labelledby',
        screen.getByTestId(`slide-0`).id
      );
      expect(firstItem).toHaveAttribute('aria-posinset', '1');
      expect(firstItem).toHaveAttribute('aria-setsize', '3');
      expect(firstItem).toHaveAttribute('aria-selected', 'true');
      expect(firstItem).toHaveAttribute('tabindex', '0');
      expect(firstItem).toHaveAttribute('type', 'button');

      expect(navItems[1]).toHaveAttribute('tabindex', '-1');
      expect(navItems[1]).toHaveAttribute('aria-posinset', '2');

      expect(navItems[2]).toHaveAttribute('tabindex', '-1');
      expect(navItems[2]).toHaveAttribute('aria-posinset', '3');
    });

    it('calls provided onClick prop', () => {
      const onClick = jest.fn();
      const slides = [1, 2, 3].map((num) => ({id: `${num}`}));
      function Comp() {
        const [activeIndex, setIndex] = useState(0);
        return (
          <Carousel
            aria-label="Hello"
            onActivePageIndexChange={setIndex}
            items={slides}
          >
            <Carousel.Scroller>
              {(s: typeof slides[number], i) => (
                <Carousel.Item testIds={{enzyme: `slide-${i}`}}>
                  {s.id}
                </Carousel.Item>
              )}
            </Carousel.Scroller>
            <Carousel.Nav testIds={{enzyme: 'nav'}}>
              {(_, i) => (
                <Carousel.NavItem
                  onClick={onClick}
                  testIds={{enzyme: `navitem-${i}`}}
                >
                  {activeIndex === i ? 'active' : 'not selected'}
                </Carousel.NavItem>
              )}
            </Carousel.Nav>
          </Carousel>
        );
      }

      render(<Comp />);

      fireEvent.click(screen.getAllByRole('tab')[0]);

      expect(onClick).toHaveBeenCalled();
    });

    it('throws an error when used outside of a Carousel component', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      expect(() =>
        render(
          <Carousel.Nav>
            {() => <Carousel.NavItem>hello</Carousel.NavItem>}
          </Carousel.Nav>
        )
      ).toThrowErrorMatchingInlineSnapshot(
        `"[Homebase]: useDescendantsContext must be used within DescendantsProvider"`
      );
      consoleError.mockRestore();
    });

    it('Nav.Item throws an error when used outside of a Carousel component', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      expect(() =>
        render(<Carousel.NavItem>hello</Carousel.NavItem>)
      ).toThrowErrorMatchingInlineSnapshot(
        `"[Homebase]: useContext returned \`undefined\`. Seems you forgot to wrap component within Provider"`
      );
      consoleError.mockRestore();
    });
  });
});

describe('Carousel Buttons', () => {
  const carouselPrevButtonClick = jest.fn();
  const childPrevButtonClick = jest.fn();
  const carouselNextButtonClick = jest.fn();
  const childNextButtonClick = jest.fn();
  let prevButtonRef: HTMLButtonElement | undefined | null;
  let nextButtonRef: HTMLButtonElement | undefined | null;

  function Comp() {
    return (
      <Carousel aria-label="Hello">
        <Carousel.PreviousButton onClick={carouselPrevButtonClick}>
          {/* Buttons initialize disabled because we can't derive page count in JSDOM */}
          <button
            disabled={false}
            onClick={childPrevButtonClick}
            ref={(node) => (prevButtonRef = node)}
          >
            previous
          </button>
        </Carousel.PreviousButton>
        <Carousel.NextButton onClick={carouselNextButtonClick}>
          {/* Buttons initialize disabled because we can't derive page count in JSDOM */}
          <button
            disabled={false}
            onClick={childNextButtonClick}
            ref={(node) => (nextButtonRef = node)}
          >
            next
          </button>
        </Carousel.NextButton>
        <Carousel.Scroller>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Scroller>
      </Carousel>
    );
  }

  it('click handlers called with expected arguments', () => {
    render(<Comp />);
    const [prev, next] = screen.getAllByRole('button');

    fireEvent.click(prev);
    // Called with page index
    expect(typeof carouselPrevButtonClick.mock.calls[0][0]).toBe('number');
    // Called with event
    expect(childPrevButtonClick).toHaveBeenCalledWith(
      expect.objectContaining({target: prev})
    );

    fireEvent.click(next);
    // Called with page index
    expect(typeof carouselNextButtonClick.mock.calls[0][0]).toBe('number');
    // Called with event
    expect(childNextButtonClick).toHaveBeenCalledWith(
      expect.objectContaining({target: next})
    );
  });

  it('can have their refs accessed', () => {
    render(<Comp />);
    expect(prevButtonRef).toEqual(screen.getAllByRole('button')[0]);
    expect(nextButtonRef).toEqual(screen.getAllByRole('button')[1]);
  });

  it('throws errors when used incorrectly', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function BadCompPrev() {
      return (
        <Carousel aria-label="Hello">
          {/* @ts-expect-error */}
          <Carousel.PreviousButton />
          <Carousel.Scroller>
            <Carousel.Item>A</Carousel.Item>
          </Carousel.Scroller>
        </Carousel>
      );
    }
    function BadCompNext() {
      return (
        <Carousel aria-label="Hello">
          {/* @ts-expect-error */}
          <Carousel.NextButton />
          <Carousel.Scroller>
            <Carousel.Item>A</Carousel.Item>
          </Carousel.Scroller>
        </Carousel>
      );
    }

    expect(() => render(<BadCompPrev />)).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel.PreviousButton]: Prop \`children\` expected a single ReactElement."`
    );
    expect(() => render(<BadCompNext />)).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel.NextButton]: Prop \`children\` expected a single ReactElement."`
    );
    consoleError.mockRestore();
  });

  it('throws error when receives more than one child', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function BadCompPrev() {
      return (
        <Carousel aria-label="Hello">
          {/* @ts-expect-error */}
          <Carousel.PreviousButton>
            <div />
            <div />
          </Carousel.PreviousButton>
          <Carousel.Scroller>
            <Carousel.Item>A</Carousel.Item>
          </Carousel.Scroller>
        </Carousel>
      );
    }
    function BadCompNext() {
      return (
        <Carousel aria-label="Hello">
          {/* @ts-expect-error */}
          <Carousel.NextButton>
            <div />
            <div />
          </Carousel.NextButton>
          <Carousel.Scroller>
            <Carousel.Item>A</Carousel.Item>
          </Carousel.Scroller>
        </Carousel>
      );
    }

    expect(() => render(<BadCompNext />)).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel.NextButton]: Prop \`children\` expected a single ReactElement."`
    );
    expect(() => render(<BadCompPrev />)).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel.PreviousButton]: Prop \`children\` expected a single ReactElement."`
    );
    consoleError.mockRestore();
  });

  it('throws an error if Buttons cannot accept ref', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function NotForwardRefComponent(props) {
      return <button {...props} />;
    }

    function BadCompPrev() {
      return (
        <Carousel aria-label="Hello">
          <Carousel.PreviousButton>
            <NotForwardRefComponent>hey</NotForwardRefComponent>
          </Carousel.PreviousButton>
          <Carousel.Scroller>
            <Carousel.Item>A</Carousel.Item>
          </Carousel.Scroller>
        </Carousel>
      );
    }
    function BadCompNext() {
      return (
        <Carousel aria-label="Hello">
          <Carousel.NextButton>
            <NotForwardRefComponent>hey</NotForwardRefComponent>
          </Carousel.NextButton>
          <Carousel.Scroller>
            <Carousel.Item>A</Carousel.Item>
          </Carousel.Scroller>
        </Carousel>
      );
    }
    expect(() => render(<BadCompNext />)).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel.NextButton]: Prop \`children\` expected a ReactElement that can accept a \`ref\`."`
    );
    expect(() => render(<BadCompPrev />)).toThrowErrorMatchingInlineSnapshot(
      `"[Homebase] [Carousel.NextButton]: Prop \`children\` expected a ReactElement that can accept a \`ref\`."`
    );

    consoleError.mockRestore();
  });
});
