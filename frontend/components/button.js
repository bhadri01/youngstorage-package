export default function Button(props) {
  const { children } = props;
  return (
      <button 
        style={props.style}
        className={`btn ${props.color && props.color} ${props.className}`}
        onClick={props.onClick}
      >
        {children}
        {props.value ? props.value : "alert"}
      </button>
  );
}
