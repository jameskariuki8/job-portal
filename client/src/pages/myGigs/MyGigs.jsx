import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./myGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res, req) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this gig?')) mutation.mutate(id);
  };

  const { data: bidCounts } = useQuery({
    queryKey: ['myGigs-bidcounts', data?.length || 0],
    queryFn: async () => {
      const entries = await Promise.all((data || []).map(async g => {
        try { const c = await newRequest.get(`/bids/gig/${g._id}/count`).then(r=>r.data?.count||0); return [g._id, c]; } catch { return [g._id, 0]; }
      }));
      return Object.fromEntries(entries);
    },
    enabled: !!(data && data.length),
  });

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>

          <div className="grid">
            {(data || []).map((gig) => (
              <div className="gigcard" key={gig._id}>
                <div className="thumb">
                  {gig.cover ? (
                    <img src={gig.cover} alt={gig.title} />
                  ) : (
                    <div className="no-visuals">No visuals</div>
                  )}
                </div>
                <div className="content">
                  <div className="row1">
                    <h3 className="titletext">{gig.title}</h3>
                    {gig.status && gig.status !== 'available' && (
                      <span className={`status ${gig.status}`}>{gig.status.replace('_',' ')}</span>
                    )}
                  </div>
                  <div className="row2">
                    <span className="badge">${gig.priceMin}-{gig.priceMax}</span>
                    <span className="badge blue">{(bidCounts && bidCounts[gig._id]) || 0} bids</span>
                    <span className="badge">{gig.cat}</span>
                  </div>
                </div>
                <div className="actions">
                  <button className="edit" onClick={()=>navigate(`/add?edit=${gig._id}`)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(gig._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGigs;