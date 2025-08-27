import { Ticket } from "@/types";
import React from "react";
import { Search } from "lucide-react";
import TicketCard from "./ticket-card";

const TicketList = ({filteredTickets} : {filteredTickets : Ticket}) => {
  return (
    <div className="space-y-6">
      {filteredTickets.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No se encontraron tickets
          </h3>
          <p className="text-slate-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        filteredTickets.map((ticket, index) => <TicketCard ticket={ticket} />)
      )}
    </div>
  );
};

export default TicketList;
