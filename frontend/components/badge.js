
export default function Badge(props) {
  return (
    <div style={props.style} className={`badge ${props.color && props.color}`}>
      {props.value ? props.value : "burn"}
    </div>
  );
}
