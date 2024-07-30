'use client';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Timer from "@/components/Timer";

const GET_POSTES = gql`
  query getAllPostes {
    getAllPostes {
      _id
      title
    }
  }
`;

const Navbar = () => {
    const { data, loading, error } = useQuery(GET_POSTES);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50">
            <div className="container mx-auto flex justify-center items-center">
                <div className="overflow-x-auto whitespace-nowrap">
                    <ul className="flex space-x-4">
                        {data.getAllPostes.map(post => (
                            <li key={post._id} className="inline-block">
                                <div className="relative text-center dark:drop-shadow-[0_0_0.3rem_#ffffffff] white:invert">
                                    <Link
                                        href={`/postes/${post._id}`}
                                        className="text-1xl font-extrabold hover:bg-gray-700 px-3 py-2 rounded">
                                        {post.title}
                                    </Link>
                                </div>
                                <div style={{ marginTop: "20px" }} className="relative dark:drop-shadow-[0_0_0.3rem_#ffffffff] black:invert">
                                    <Timer />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
