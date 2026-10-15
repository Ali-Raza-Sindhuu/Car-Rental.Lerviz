import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { Loading, Notice, PageHeading, Panel } from "@/components/app/Ui";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api("/admin/dashboard").then((result) => setData(result.data)).catch(setError); }, []);
  return <><PageHeading title="Operations overview" description="Current fleet, reservations, and settled revenue." /><Notice error={error} />{!data ? !error && <Loading /> : <><div className="portal-grid">{[
    ["Fleet vehicles", data.totalVehicles], ["Available now", data.availableNow], ["Active rentals", data.activeRentals],
    ["Pending bookings", data.pendingBookings], ["Customers", data.customers], ["Fleet utilization", `${data.fleetUtilizationPercent}%`],
    ["Revenue today", money(data.revenue?.today)], ["Revenue this month", money(data.revenue?.month)],
  ].map(([label, value]) => <div className="portal-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><Panel title="Top rented vehicles" className="" ><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Vehicle</th><th>Plate</th><th>Rentals</th></tr></thead><tbody>{data.topVehicles?.map((vehicle) => <tr key={vehicle.id}><td>{vehicle.make} {vehicle.model}</td><td>{vehicle.plateNo}</td><td>{vehicle.rentals}</td></tr>)}</tbody></table></div></Panel><div className="portal-links"><Link to="/app/admin/bookings">Manage bookings</Link><Link to="/app/admin/vehicles">Manage fleet</Link><Link to="/app/admin/reports">View reports</Link></div></>}</>;
}
