export default function Loader({ small = false }) {
  return (
    <div className={`text-center ${small ? 'py-3' : 'py-5'}`}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
