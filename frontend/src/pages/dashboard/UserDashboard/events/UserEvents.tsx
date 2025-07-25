import { useState } from "react";
import { useGetEventsQuery } from "../../../../Features/events/eventsAPI";
import { useGetVenuesQuery } from "../../../../Features/venues/venuesAPI";
import EventCard from "../../../../components/events/EventCard";

const UserEvents = () => {
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery();
  const { data: venuesData, isLoading: venuesLoading } = useGetVenuesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVenue, setSelectedVenue] = useState("All");

  const venues = venuesData?.data ?? [];
  const events = eventsData?.data ?? [];

  const categories = Array.from(new Set(events.map(e => e.category)));

  const venueMap = new Map(venues.map((v) => [v.venueID, v]));

  // Apply filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesVenue = selectedVenue === "All" || event.venueID.toString() === selectedVenue;
    return matchesSearch && matchesCategory && matchesVenue;
  });

  if (eventsLoading || venuesLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Browse Events</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title..."
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="select select-bordered"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Venue Filter */}
        <select
          className="select select-bordered"
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="All">All Venues</option>
          {venues.map((v) => (
            <option key={v.venueID} value={v.venueID}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* Event Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.eventID}
              event={event}
              venue={venueMap.get(event.venueID)}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default UserEvents;
