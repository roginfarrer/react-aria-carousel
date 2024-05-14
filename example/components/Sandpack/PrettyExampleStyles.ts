export default `.root {
  display: grid;
  grid-template-areas: ". scroller ." ". tabs .";
  grid-auto-columns: min-content 1fr min-content;
  grid-auto-rows: 1fr min-content;
  column-gap: 16px;
  position: relative;
  align-items: center;
}
.button {
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease 0.2s;
  border-radius: 9999px;
  transform: translateX(var(--translateX)) scale(var(--scale));
}
.button:not([disabled]):hover {
  --scale: 1.05;
  color: blue;
  box-shadow: 0 0 0 4px #333;
}
.button--prev:not([disabled]):hover {
  --translateX: -5%;
}
.button--next:not([disabled]):hover {
  --translateX: 5%;
}
.scroller {
  grid-area: scroller;
  display: grid;
  overflow: auto;
  scrollbar-width: none;
}
.scroller[data-orientation="horizontal"] {
  scroll-snap-type: x mandatory;
  grid-auto-flow: column;
  overscroll-behavior-x: contain;
}
.item {
  aspect-ratio: 16 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  background-color: palegoldenrod;
}
.tabs {
  grid-area: tabs;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
.tab {
  border-radius: 9999px;
  height: 16px;
  width: 16px;
  background-color: gray;
  transition: background-color 0.2s ease;
}
.tab:hover {
  background-color: blue;
}
.tab[aria-selected="true"] {
  background-color: darkgrey;
}
`;
