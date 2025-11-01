"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import { IoLogOutOutline, IoArrowForwardCircleOutline, IoCalendarOutline, IoTimeOutline, IoCallOutline, IoLocationOutline } from "react-icons/io5"; // Added more icons
import { BiDollar } from "react-icons/bi"; // Icon for total

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register");
    }
  }, [status, router]);

  // useEffect(() => {
  //   if (session?.user?.email) {
  //     fetch("/api/tasks", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: session.user.email }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.success && Array.isArray(data.tasks)) setTasks(data.tasks);
  //         else setTasks([]);
  //       })
  //       .catch(() => setTasks([]))
  //       .finally(() => setLoadingTasks(false));
  //   }
  // }, [session]);

  const handleCancel = async (orderId) => {
    const task = tasks.find((t) => t.order_id === orderId);
    if (task?.is_completed || task?.is_approved) {
      alert("This task has been approved or completed and cannot be cancelled.");
      return;
    }
    if (!confirm("Are you sure you want to cancel this task/order?")) return;

    try {
      const res = await fetch("/api/tasks/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled successfully.");
        setTasks((prev) =>
          prev.map((t) =>
            t.order_id === orderId
              ? { ...t, is_canceled: true, status: "Cancelled" }
              : t
          )
        );
      } else {
        alert(data.message || "Failed to cancel order.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleLogout = () => signOut({ callbackUrl: "/" });

  if (status === "loading")
    return <div className="flex items-center justify-center min-h-screen bg-gray-900"><p className="text-xl text-indigo-400 animate-pulse">Loading profile data...</p></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-[70px] from-gray-950 to-gray-800 p-4 sm:p-8 md:p-12 font-sans text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-700 pb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          <span className="text-indigo-400"></span> My Profile
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02] text-sm font-medium group"
        >
          <IoLogOutOutline className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-gray-900/50 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-full shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400 animate-pulse-slow">
          <FaRegUser className="w-8 h-8 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-white tracking-wide">{session.user.name}</h2>
          <p className="text-indigo-300 text-lg mt-1 font-mono">{session.user.email}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="mt-12">
        <h3 className="text-3xl font-bold text-white mb-8 border-l-4 border-indigo-400 pl-3">
           Order History
        </h3>
        <div className="grid gap-6 max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar">
          {loadingTasks ? (
            <p className="text-indigo-400">Fetching your order history...</p>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center bg-gray-800/60 rounded-xl border border-gray-700 shadow-md">
              <p className="text-gray-400 text-lg">No orders found. Time to place one! 🚀</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="group relative bg-gray-800/60 border border-gray-700 p-5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/20 rounded-bl-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                <div className="relative z-10">
                  {/* Order Header */}
                  <div className="flex justify-between items-center flex-wrap gap-3 pb-3 mb-3 border-b border-gray-700">
                    <div className="flex-1 min-w-[180px]">
                      <p className="font-medium text-gray-400 text-xs uppercase tracking-wider">
                        Order ID: <span className="text-white font-mono text-sm">{task.order_id}</span>
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Placed On: {new Date(task.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* <BiDollar className="w-4 h-4 text-green-400" /> */}
                      <p className="text-xl text-green-400 font-extrabold">
                        ₹{task.total}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
               <div className="flex justify-between items-center flex-wrap gap-2 pt-2">
  <p className="text-sm text-gray-300 flex items-center gap-1">
    Status:{" "}
    <span
      className={`font-bold uppercase text-xs tracking-wider px-2 py-1 rounded-full ${
        task.is_completed
          ? "bg-green-600/30 text-green-400"
          : task.is_approved
          ? "bg-blue-600/30 text-blue-400"
          : task.is_canceled
          ? "bg-yellow-600/30 text-yellow-400"
          : "bg-white-600/30 text-red-700 animate-pulse"
      }`}
    >
      {task.status}
    </span>
  </p>

  <div className="flex gap-2">
    {/* Cancel Button */}
    {!task.is_completed &&
      !task.is_canceled &&
      task.status !== "Accepted" &&
      task.status !== "Rejected" && (
        <button
          onClick={() => handleCancel(task.order_id)}
          className="bg-red-700/80 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-lg shadow-md transition transform hover:scale-105 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 ease-out"
        >
          Cancel Order
        </button>
      )}

    
     {/* {!task.is_completed && task.cart.length > 0 && (
      <button
        onClick={() => router.push(`/review/${task.order_id}`)
}
        className="bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs px-4 py-1.5 rounded-lg shadow-md transition transform hover:scale-105 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 ease-out"
      >
        Leave Review
      </button>
    )}  */}
  </div>
</div>


                  {/* Items and Details - Collapsible/Expandable for smaller view? */}
                  {/* For now, keeping it visible but more compact */}
                  <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                    {/* Items List */}
                    <div>
                      <h4 className="font-semibold text-indigo-300 mb-2 flex items-center gap-1">
                        <IoArrowForwardCircleOutline className="w-4 h-4" /> Items:
                      </h4>
                      <ul className="space-y-1 text-xs max-h-20 overflow-y-auto pr-1 custom-scrollbar-thin">
                        {task.cart.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center border-b border-gray-800 pb-0.5 last:border-b-0"
                          >
                            <span className="truncate pr-1">{item.name}</span>
                            <span className="text-indigo-300 font-medium whitespace-nowrap">₹{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Schedule & Contact */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-indigo-300 mb-2 flex items-center gap-1">
                        <IoCalendarOutline className="w-4 h-4" /> Schedule:
                      </h4>
                      <p className="flex items-center gap-2">
                        <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{task.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <IoTimeOutline className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{task.timeSlot}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <IoCallOutline className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{task.phone}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <IoLocationOutline className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="text-white">{task.address}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom scrollbar - Updated for better visibility on dark background */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937; /* Darker track */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5; /* Indigo 600 */
          border-radius: 10px;
          border: 2px solid #1f2937; /* Add border to make it pop */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1; /* Indigo 500 */
        }

        .custom-scrollbar-thin::-webkit-scrollbar {
            width: 4px; /* Thinner scrollbar */
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
            background: #1f2937;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
            background: #4f46e580; /* Semi-transparent indigo */
            border-radius: 10px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #4f46e5;
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
