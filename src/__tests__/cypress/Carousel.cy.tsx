import React, {useMemo, useState} from 'react';
import Carousel from '../..';
import {cy, describe, it} from 'local-cypress';

const SLIDE_SIZE = 500;

const SlideContent = ({content, ...props}: {content: number | string}) => {
  const color = useMemo(
    () => `hsla(${Math.floor(Math.random() * 360)}, 100%, 70%, 1)`,
    []
  );
  return (
    <div
      {...props}
      style={{
        width: '100%',
        height: `${SLIDE_SIZE}px`,
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 50,
      }}
    >
      {content}
    </div>
  );
};

export const Basic = (props) => {
  const [slides] = useState([...Array(5)].map((_, i) => ({id: `${i}`})));
  type Slide = typeof slides[number];
  return (
    <Carousel
      aria-label="Colors"
      items={slides}
      {...props}
      maxWidth="500px"
      maxHeight="500px"
    >
      <Carousel.PreviousButton>
        <button>Previous</button>
      </Carousel.PreviousButton>
      <Carousel.Scroller testIds={{cypress: 'scroller'}}>
        {(s: Slide) => (
          <Carousel.Item key={s.id}>
            <SlideContent data-cypress-id={`slide-${s.id}`} content={s.id} />
          </Carousel.Item>
        )}
      </Carousel.Scroller>
      <Carousel.NextButton>
        <button>Next</button>
      </Carousel.NextButton>
    </Carousel>
  );
};

const CarouselWithParts = (props) => {
  const [slides] = useState([...Array(5)].map((_, i) => ({id: `${i}`})));
  type Slide = typeof slides[number];
  return (
    <Carousel aria-label="Colors" items={slides} {...props} maxWidth="500px">
      <Carousel.PreviousButton>
        <button>Previous</button>
      </Carousel.PreviousButton>
      <Carousel.Scroller testIds={{cypress: 'scroller'}}>
        {(s: Slide) => (
          <Carousel.Item key={s.id}>
            <SlideContent data-cypress-id={`slide-${s.id}`} content={s.id} />
          </Carousel.Item>
        )}
      </Carousel.Scroller>
      <Carousel.NextButton>
        <button>Next</button>
      </Carousel.NextButton>
      <Carousel.Nav display="flex" gap="$1500">
        {(_, index) => (
          <Carousel.NavItem
            size="32px"
            bg="$backgroundPrimaryIdle"
            borderRadius="50vw"
            testIds={{cypress: `nav-item-${index}`}}
          >
            {index}
          </Carousel.NavItem>
        )}
      </Carousel.Nav>
    </Carousel>
  );
};

describe('Carousel', () => {
  it('shows and hide elements within scroll container', () => {
    cy.mount(<Basic />);
    cy.findByTestId('slide-0').should('be.visible');
    cy.findByTestId('slide-2').should('not.be.visible');

    cy.findByTestId('scroller').scrollTo(SLIDE_SIZE * 2, 0);

    cy.findByTestId('slide-0').should('not.be.visible');
    cy.findByTestId('slide-2').should('be.visible');
  });

  it('moves focus to the previous button when the next button is clicked and the slide is advanced on the second-to-last item', () => {
    cy.mount(<CarouselWithParts />);
    cy.findByTestId('nav-item-4').realClick();
    cy.findByTestId('slide-4').should('be.visible');
    cy.findByRole('button', {name: 'Next'}).realClick();
    cy.findByRole('button', {name: 'Previous'}).should('have.focus');
    cy.findByRole('button', {name: 'Next'}).should('be.disabled');
  });

  it('moves focus to the next button when the previous button is clicked and the slide is decreased on the second item', () => {
    cy.mount(<CarouselWithParts />);
    cy.findByTestId('nav-item-1').realClick();

    // Ensuring we're completely on the second slide
    cy.findByTestId('slide-1').should('be.visible');
    cy.findByTestId('slide-0').should('not.be.visible');

    cy.findByRole('button', {name: 'Previous'}).realClick();
    cy.findByRole('button', {name: 'Next'}).should('have.focus');
    cy.findByRole('button', {name: 'Previous'}).should('be.disabled');
  });

  it('when enableLoopPagination, next click goes to the first slide from the last slide', () => {
    cy.mount(<CarouselWithParts enableLoopPagination />);
    cy.findByTestId('nav-item-4').realClick();

    // Ensuring we're completely on the last slide
    cy.findByTestId('slide-4').should('be.visible');
    cy.findByTestId('slide-3').should('not.be.visible');

    cy.findByRole('button', {name: 'Next'}).realClick();
    cy.findByTestId('slide-0').should('be.visible');
  });

  it('when enableLoopPagination, previous click goes to the last slide from the first slide', () => {
    cy.mount(<CarouselWithParts enableLoopPagination />);
    cy.findByRole('button', {name: 'Previous'}).realClick();
    cy.findByTestId('slide-4').should('be.visible');
  });

  it('The previous button is disabled on the first item when enableLoopPagination={false}', () => {
    cy.mount(<CarouselWithParts />);
    cy.findByTestId('slide-0').should('be.visible');
    cy.findByRole('button', {name: 'Previous'}).should('be.disabled');
  });

  it('The next button is disabled on the last item when enableLoopPagination={false}', () => {
    cy.mount(<CarouselWithParts />);
    cy.findByTestId('nav-item-4').realClick();

    // Ensuring we're completely on the last slide
    cy.findByTestId('slide-4').should('be.visible');
    cy.findByTestId('slide-3').should('not.be.visible');

    cy.findByRole('button', {name: 'Next'}).should('be.disabled');
  });

  describe('keyboard navigation', () => {
    it('ArrowLeft and ArrowRight paginate when horizontal', () => {
      cy.mount(<Basic />);
      // Just grabbing a focusable element within the Carousel root in order to capture the keydown events
      cy.findByRole('button', {name: 'Next'}).focus();

      // Should go to the next slide
      cy.realPress('ArrowRight');
      cy.findByTestId('slide-0').should('not.be.visible');
      cy.findByTestId('slide-1').should('be.visible');

      // Should be a noop
      cy.realPress('ArrowUp');
      cy.findByTestId('slide-1').should('be.visible');

      // Should be a noop
      cy.realPress('ArrowDown');
      cy.findByTestId('slide-1').should('be.visible');

      // Should go to the previous slide
      cy.realPress('ArrowLeft');
      cy.findByTestId('slide-1').should('not.be.visible');
      cy.findByTestId('slide-0').should('be.visible');
    });

    it('ArrowUp and ArrowDown paginate when vertical', () => {
      cy.mount(<Basic orientation="vertical" />);
      // Just grabbing a focusable element within the Carousel root in order to capture the keydown events
      cy.findByRole('button', {name: 'Next'}).focus();

      // Should go to the next slide
      cy.realPress('ArrowDown');
      cy.findByTestId('slide-0').should('not.be.visible');
      cy.findByTestId('slide-1').should('be.visible');

      // Should be a noop
      cy.realPress('ArrowLeft');
      cy.findByTestId('slide-1').should('be.visible');

      // Should be a noop
      cy.realPress('ArrowRight');
      cy.findByTestId('slide-1').should('be.visible');

      // Should go to the previous slide
      cy.realPress('ArrowUp');
      cy.findByTestId('slide-1').should('not.be.visible');
      cy.findByTestId('slide-0').should('be.visible');
    });
  });

  describe('onScrollPositionChange', () => {
    it('gets called with expected arguments', () => {
      function Test() {
        const [scrollPosition, setScrollPosition] = React.useState();
        return (
          <>
            <Basic onScrollPositionChange={setScrollPosition} />
            <p data-cypress-id="scroll-position">{scrollPosition}</p>
          </>
        );
      }
      cy.mount(<Test />);

      cy.findByTestId('scroller').scrollTo(SLIDE_SIZE * 2, 0);
      cy.findByTestId('scroll-position').should('have.text', 'middle');
      cy.findByTestId('scroller').scrollTo(SLIDE_SIZE * 5, 0);
      cy.findByTestId('scroll-position').should('have.text', 'end');
      cy.findByTestId('scroller').scrollTo(0, 0);
      cy.findByTestId('scroll-position').should('have.text', 'start');
    });
  });

  describe('Scrollbar', () => {
    const ScrollbarCarousel = (props) => {
      const [slides] = useState([...Array(5)].map((_, i) => ({id: `${i}`})));
      type Slide = typeof slides[number];
      return (
        <Carousel
          aria-label="Colors"
          items={slides}
          {...props}
          maxWidth="500px"
        >
          <Carousel.Scroller testIds={{cypress: 'scroller'}}>
            {(s: Slide) => (
              <Carousel.Item key={s.id}>
                <SlideContent
                  data-cypress-id={`slide-${s.id}`}
                  content={s.id}
                />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
          <Carousel.Scrollbar testIds={{cypress: 'scrollbar'}} />
        </Carousel>
      );
    };

    it('causes the carousel to scroll', () => {
      cy.mount(<ScrollbarCarousel />);
      cy.findByTestId('slide-0').should('be.visible');
      cy.findByTestId('slide-2').should('not.be.visible');
      cy.findByTestId('scrollbar-thumb').realMouseDown();
      cy.findByTestId('scrollbar-thumb').realMouseMove(SLIDE_SIZE / 2, 0);
      // Don't trigger mouse up to quickly, otherwise the thumb position reverts
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.findByTestId('scrollbar-thumb').realMouseUp();
      cy.findByTestId('slide-0').should('not.be.visible');
      cy.findByTestId('slide-2').should('be.visible');
    });

    it('follows the carousel scroll position', () => {
      cy.mount(<ScrollbarCarousel />);
      cy.findByTestId('scrollbar-thumb').should(
        'have.css',
        'transform',
        'matrix(1, 0, 0, 1, 0, 0)'
      );
      cy.findByTestId('scroller').scrollTo(SLIDE_SIZE * 2, 0);
      cy.findByTestId('scrollbar-thumb').should(
        'have.css',
        'transform',
        'matrix(1, 0, 0, 1, 200, 0)'
      );
    });
  });
});
