export default function Alerts(props) {
  return (
    <div className="info-container">
      <img alt="" src="/rou.png" width="64px" />
      <div className="low">
        <h1>Info</h1>
        <p>
          {props.value}
        </p>
      </div>
    </div>
  );
}
