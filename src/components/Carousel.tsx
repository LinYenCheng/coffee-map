import src1 from './assets/1.jpg';
import src2 from './assets/2.jpg';
import src3 from './assets/3.jpg';

export default function Carousel() {
  return (
    <div id="carouselExampleCaptions" className="carousel slide">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        />
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        />
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        />
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={src1} className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h2>無限時咖啡廳</h2>
            <p>享受咖啡芬芳的工作氛圍</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={src2} className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h2>夜貓咖啡廳</h2>
            <p>深夜街角的一抹芬芳</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={src3} className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h2>工作咖啡廳</h2>
            <p>方便遠端工作的無線上網和插座</p>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
