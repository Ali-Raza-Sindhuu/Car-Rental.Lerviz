import { useState } from "react";
import { Car } from "lucide-react";

const VehicleImage = ({ src, alt, className = "", fallbackClassName = "", ...props }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div role="img" aria-label={alt ? `${alt} — image unavailable` : "Vehicle image unavailable"} className={`flex size-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 ${fallbackClassName}`}><Car aria-hidden="true" className="size-8" strokeWidth={1.5} /><span className="text-center text-[11px]">Image coming soon</span></div>;
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...props} />;
};
export default VehicleImage;
