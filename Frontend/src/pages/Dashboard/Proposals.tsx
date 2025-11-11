import { useEffect, useState } from 'react';
import { listMyProposals } from '@/api/proposals';

interface Proposal {
  _id: string;
  project: {
    _id: string;
    title: string;
  };
  coverLetter: string;
  bidAmount: number;
  durationDays: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await listMyProposals();
        setProposals(res.data.data || []);
      } catch (e: any) {
        setError(e.response?.data?.error || 'Failed to fetch proposals');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-white p-8">Loading…</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">My Proposals</h1>
      {proposals.length === 0 && <p>No proposals yet.</p>}
      <div className="space-y-4">
        {proposals.map((p) => (
          <div key={p._id} className="border border-gray-700 rounded p-4 bg-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{p.project.title}</h2>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  p.status === 'Accepted'
                    ? 'bg-green-600'
                    : p.status === 'Rejected'
                    ? 'bg-red-600'
                    : 'bg-yellow-600'
                }`}
              >
                {p.status}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">Bid: ${p.bidAmount} – {p.durationDays} days</p>
            <p className="text-gray-400 text-sm whitespace-pre-wrap">{p.coverLetter}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
