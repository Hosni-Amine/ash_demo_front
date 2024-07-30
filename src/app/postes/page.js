'use client';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import "../globals.css";
import { useState } from 'react';

// Queries and mutations
const GET_POSTES = gql`
  query getAllPostes {
    getAllPostes {
      _id
      title
      description
    }
  }
`;

const ADD_POSTE = gql`
  mutation AddPoste($input: CreatePosteInput!) {
    createPoste(CreatePosteInput: $input) {
      _id
      title
      description
    }
  }
`;

export default function Postes() {
    const { data, loading, error, refetch } = useQuery(GET_POSTES);
    const [addPoste] = useMutation(ADD_POSTE);
    const [showForm, setShowForm] = useState(false);
    const [newPosteTitle, setNewPosteTitle] = useState('');
    const [newPosteDescription, setNewPosteDescription] = useState('');

    const handleAddPoste = async () => {
        try {
            await addPoste({
                variables: {
                    input: {
                        title: newPosteTitle,
                        description: newPosteDescription,
                    },
                },
            });
            refetch();
            setNewPosteTitle('');
            setNewPosteDescription('');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding poste:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            </div>

            <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
                <img src={'/image.png'} width={120} height={120} alt="Plus Icon" />
            </div>

            <button
                style={{ marginTop: '25px' }}
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600 mb-8"
            >
                {showForm ? 'Hide Form' : 'Add Poste'}
            </button>
            {showForm && (
                <div className="mb-8 lg:w-full lg:max-w-5xl">
                    <h3 className="text-2xl font-semibold mb-3">Add Poste</h3>
                    <div className="grid gap-4 lg:grid-cols-1 lg:gap-6">
                        <div>
                            <label htmlFor="posteTitle" className="block text-sm font-medium text-gray-700 mb-1">Poste Title</label>
                            <input
                                id="posteTitle"
                                type="text"
                                value={newPosteTitle}
                                onChange={(e) => setNewPosteTitle(e.target.value)}
                                placeholder="Enter poste title"
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleAddPoste}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
                        >
                            Add Poste
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
                {data.getAllPostes.map((poste) => (
                    <Link key={poste._id} href={`/postes/${poste._id}`} passHref>
                        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                            <h2 className="mb-3 text-2xl font-semibold">
                                {poste.title}{" "}
                                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                  -&gt;
                                </span>
                            </h2>
                        </div>
                    </Link>

                ))}
            </div>
        </main>
    );
}
