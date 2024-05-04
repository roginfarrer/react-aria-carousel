import { Carousel } from "./carousel.js";
import { App as NewCarouselExamples } from "./new-carousel";

export default function App() {
  return (
    <div style={{ display: "grid", gap: 50, gridAutoFlow: "row" }}>
      <NewCarouselExamples />
      <Carousel />
      <Carousel orientation="vertical" />
    </div>
  );
}
