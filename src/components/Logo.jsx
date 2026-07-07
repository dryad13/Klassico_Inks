import logo from '../assets/klassico-logo.png';

const Logo = ({ className = "h-16 w-auto" }) => {
  return (
    <img
      src={logo}
      alt="Klassico Inks"
      className={className}
    />
  );
};

export default Logo;
