'use client'; // Ensure this line is at the top of your component file

import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../../globals.css";
import Timer from "../../../components/Timer";

// Queries and mutations
const GET_POST = gql`
  query getPosteById($id: String!) {
    getPosteById(id: $id) {
      _id
      title
      description
    }
  }
`;

const GET_GAMES_BY_POSTE_ID = gql`
  query getGamesByPosteId($posteId: String!) {
    getGamesByPosteId(posteId: $posteId) {
      _id
      name
      startDate
      endDate
      price
      usernumber
    }
  }
`;

const ADD_GAME = gql`
  mutation AddGame($input: CreateGameInput!) {
    createGame(CreateGameInput: $input) {
      _id
      name
    }
  }
`;

const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      _id
    } 
  }
`;

export default function PosteDetails({ params }) {
  const postId = params.postId;
  console.log(postId)

  const { data: posteData, loading: posteLoading, error: posteError } = useQuery(GET_POST, {
    variables: { id: postId },
  });

  const { data: gamesData, loading: gamesLoading, error: gamesError, refetch } = useQuery(GET_GAMES_BY_POSTE_ID, {
    variables: { posteId: postId },
  });

  const [addGame] = useMutation(ADD_GAME);
  const [deleteGame] = useMutation(DELETE_GAME);

  const [newGameName, setNewGameName] = useState('');
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [usernumber, setUsernumber] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState(null);

  if (posteLoading || gamesLoading) return <p>Loading...</p>;
  if (posteError) return <p>Error: {posteError.message}</p>;
  if (gamesError) return <p>Error: {gamesError.message}</p>;

  const handleAddGame = async () => {
    try {
      await addGame({
        variables: {
          input: {
            name: newGameName,
            posteId: postId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            price: parseFloat(price),
            usernumber: parseFloat(usernumber),
          },
        },
      });
      refetch();
      setNewGameName('');
      setPrice(0);
      setShowForm(false);
      setStartDate(new Date());
      setEndDate(new Date());
      setUsernumber(0);
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  const handleDeleteGame = async (id) => {
    try {
      await deleteGame({
        variables: { id },
      });
      refetch();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const filteredGames = filterDate
      ? gamesData.getGamesByPosteId.filter(game =>
          new Date(game.startDate).toDateString() === filterDate.toDateString() ||
          new Date(game.endDate).toDateString() === filterDate.toDateString()
      )
      : gamesData.getGamesByPosteId;

  const sortedGames = [...filteredGames].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  const totalPrice = filteredGames.reduce((acc, game) => acc + game.price, 0);
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[500px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <div className="relative dark:drop-shadow-[0_0_0.3rem_#ffffffff] dark:invert">
            {posteData.getPosteById && (
                <div className="text-center text-white">
                  <h1 className="text-5xl font-extrabold">{posteData.getPosteById.title}</h1>
                </div>
            )}
          </div>
        </div>

        <p className="text-lg font-semibold text-yellow-500 mt-6">
          Total income on selected date: {totalPrice}
        </p>

        <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600 mt-6 mb-8"
        >
          {showForm ? 'Hide Form' : 'Add Game'}
        </button>

        {showForm && (
            <div className="mb-8 lg:w-full lg:max-w-5xl">
              <h3 className="text-2xl font-semibold mb-3">Add Game</h3>
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                <div>
                  <label htmlFor="gameName" className="block text-sm font-medium text-gray-700 mb-1">Game Name</label>
                  <input
                      id="gameName"
                      type="text"
                      value={newGameName}
                      onChange={(e) => setNewGameName(e.target.value)}
                      placeholder="Enter game name"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      placeholder="Enter price"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
                  />
                </div>
                <div>
                  <label htmlFor="usernumber" className="block text-sm font-medium text-gray-700 mb-1">Number of
                    Users</label>
                  <input
                      id="usernumber"
                      type="number"
                      value={usernumber}
                      onChange={(e) => setUsernumber(parseFloat(e.target.value))}
                      placeholder="Enter number of users"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
                  />
                </div>
                <div>
                  <label htmlFor="Start Time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <DatePicker
                      id="startDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
                  />
                </div>
                <div>
                  <label htmlFor="End Time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <DatePicker
                      id="startDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
                  />
                </div>
              </div>
              <button
                  onClick={handleAddGame}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600 mt-6"
              >
                Add Game
              </button>
            </div>
        )}

        <div className="mb-8 lg:w-full lg:max-w-5xl">
          <div className="bg-black bg-opacity-50 shadow-md rounded-lg overflow-hidden p-6">
            <h3 className="text-2xl font-semibold mb-4">Games</h3>
            <DatePicker
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                placeholderText="Filter by date"
                className="mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-black text-white w-full"
            />
            {sortedGames.length === 0 ? (
                <p>No games found</p>
            ) : (
                sortedGames.map((game) => (
                    <div key={game._id} className="bg-gray-900 rounded-lg p-4 mb-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">{game.name}</h3>
                        <p className="text-gray-400">
                          <span className="font-semibold">Start Date:</span> {new Date(game.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-semibold">End Date:</span> {new Date(game.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-semibold">Price:</span> ${game.price}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-semibold">Number of Users:</span> {game.usernumber}
                        </p>
                      </div>
                      <button style={{marginLeft:'20px'}}
                          onClick={() => handleDeleteGame(game._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                ))
            )}
          </div>
        </div>
      </main>
  );
}
