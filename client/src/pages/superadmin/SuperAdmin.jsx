import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import './superadmin.scss';

const SuperAdmin = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['superadmin-overview'],
    queryFn: async () => (await newRequest.get('/admin/overview')).data,
  });

  const onDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await newRequest.delete(`/admin/users/${userId}`);
    await queryClient.invalidateQueries({ queryKey: ['superadmin-overview'] });
  };

  const onDeleteGig = async (gigId) => {
    if (!window.confirm('Delete this gig? This cannot be undone.')) return;
    await newRequest.delete(`/admin/gigs/${gigId}`);
    await queryClient.invalidateQueries({ queryKey: ['superadmin-overview'] });
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error) return <div className="container"><h2>Error loading dashboard</h2></div>;

  const users = data?.users || [];
  const gigs = data?.gigs || [];

  return (
    <div className="container superadmin">
      <h1>Superadmin Dashboard</h1>

      <section>
        <h2>All Gigs ({gigs.length})</h2>
        <div className="table">
          <div className="row header">
            <div>Title</div>
            <div>Category</div>
            <div>Status</div>
            <div>Creator</div>
            <div>Price Range</div>
            <div>Actions</div>
          </div>
          {gigs.map(g => (
            <div key={g._id} className="row">
              <div>{g.title}</div>
              <div>{g.cat}</div>
              <div>{g.status}</div>
              <div>{g.creator ? `${g.creator.username} (${g.creator.email})` : g.userId}</div>
              <div>${g.priceMin} - ${g.priceMax}</div>
              <div>
                <button className="danger" onClick={() => onDeleteGig(g._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>All Users ({users.length})</h2>
        <div className="table">
          <div className="row header">
            <div>Username</div>
            <div>Email</div>
            <div>Seller</div>
            <div>Verified</div>
            <div>Actions</div>
          </div>
          {users.map(u => (
            <div key={u._id} className="row">
              <div>{u.username}</div>
              <div>{u.email}</div>
              <div>{u.isSeller ? 'Yes' : 'No'}</div>
              <div>{u.verified ? 'Yes' : 'No'}</div>
              <div>
                <button className="danger" onClick={() => onDeleteUser(u._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SuperAdmin;


