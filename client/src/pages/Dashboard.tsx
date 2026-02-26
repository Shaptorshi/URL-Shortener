import { useState, useEffect } from 'react'
import { api } from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'

interface Url {
  _id: string,
  originalUrl: string,
  shortCode: string,
  clicks: number
}

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState("");
  const [urls, setUrls] = useState<Url[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('Create your account to save your shortened links permanently')

  useEffect(() => {
    if (token) {
      fetchUrl();
    }
    else {
      setUrls([]);
    }
  }, [token])

  const fetchUrl = async () => {
    const response = await api.get('/url', {
      headers: { Authorization: `Bearer ${token}` }
    })

    setUrls(response.data.data);
  }
  const createUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token && urls.length >= 2) {
        setModalMessage('You have reached the guest limit of 2 links! Create a free account to shorten unlimited links');
        setIsAuthModalOpen(true);
        return;
      }
      const response = await api.post('/url', { originalUrl },
        token ?
          { headers: { Authorization: `Bearer ${token}` } }
          : {}
      )

      setOriginalUrl("");
      if (token) {
        fetchUrl();
      }
      else {

        const newUrl = response.data.data || { shortCode: response.data.shortUrl }
        setUrls((prevUrls) => [...prevUrls, newUrl]);
      }

    } catch (error: any) {
      alert('Failed to shorten the URL');
    }

  }
  const handleCopy = (shortCode: string) => {
    // const BACKEND_URL = import.meta.env.BACKEND_URL;
    const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/url/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(shortCode);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  }

  const handleLinkClick = (shortCode: string) => {
    setUrls((prevUrls) => prevUrls.map((url) => url.shortCode === shortCode ? { ...url, clicks: url.clicks + 1 } : url))
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUrls((prevUrls) =>
        prevUrls.filter((url) => url._id !== id)
      )
    } catch (error) {
      alert("Url cannot be deleted");
    }
  }
  return (
    <div className='min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30'>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">

          {/* Invisible backdrop click catcher to close modal */}
          <div className="absolute inset-0" onClick={() => setIsAuthModalOpen(false)}></div>

          {/* Modal Card */}
          <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">

            {/* Close Button (X) */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8 mt-2">
              <div className='w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-3xl shadow-lg shadow-blue-500/20 mb-5'>
                🔗
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Join LinkTrim</h3>
              {modalMessage}
              <p className="text-gray-400 text-sm">Create an account to save your links permanently and track clicks.</p>
            </div>

            {/* Modal Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/loginUser')}
                className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/registerUser')} // <-- Change this if your signup route is named differently
                className="w-full bg-gray-950 text-white font-semibold py-3.5 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800 active:scale-[0.98] transition-all"
              >
                Create an Account
              </button>

            </div>
          </div>
        </div>
      )}
      {/* Top Navigation Bar */}
      <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20'>
            🔗
          </div>
          <h1 className='text-xl font-bold tracking-tight text-white'>
            LinkTrim
          </h1>
        </div>
        {token ?
          <button
            className='text-sm font-medium text-gray-300 bg-gray-800 px-4 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 border border-gray-700 hover:border-red-500/50 transition-all duration-200'
            onClick={logout}
          >
            Logout

          </button>
          : <button className='text-sm font-medium text-gray-300 bg-gray-800 px-4 py-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 hover:cursor-pointer' onClick={() => { setIsAuthModalOpen(true) }}>Login/Sign Up</button>
        }
      </nav>

      {/* Main Content Container */}
      <main className='max-w-4xl mx-auto px-6 py-10 w-full'>
        {!token && (
          <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-4 mb-8 text-center">
            <p className="text-blue-200 text-sm md:text-base">
              You are using LinkTrim as a guest. <Link to="/loginUser" className="text-blue-400 font-bold hover:underline">Log in or create an account</Link> to save your link history permanently!
            </p>
          </div>
        )}
        {/* Input Section */}
        <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10 shadow-xl'>
          <h2 className='text-lg font-semibold mb-4 text-gray-200'>Create a new short link</h2>
          <form className='flex flex-col sm:flex-row gap-3' onSubmit={createUrl}>
            <input
              type="text"
              placeholder='Paste your long URL here (e.g., https://linkedin.com/...)'
              className='flex-1 p-4 rounded-xl bg-gray-950 border border-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600'
              onChange={(e) => setOriginalUrl(e.target.value)}
              value={originalUrl}
            />
            <button
              type="submit"
              className='bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-500 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20 whitespace-nowrap disabled:opacity-50 hover:cursor-pointer'
              disabled={!originalUrl}
            >
              Shorten URL
            </button>
          </form>
        </div>

        {/* URLs List Section */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-gray-200 flex items-center gap-2'>
            Your Links <span className='text-sm font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full'>{urls.length}</span>
          </h2>

          {urls.length === 0 ? (
            <div className='text-center py-12 border-2 border-dashed border-gray-800 rounded-2xl text-gray-500'>
              No links shortened yet. Paste a link above to get started!
            </div>
          ) : (
            urls.map((url) => (
              <div
                key={url._id}
                className='bg-gray-900 border border-gray-800 hover:border-gray-700 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200 group'
              >
                {/* Left Side: URLs */}
                <div className='flex-1 min-w-0 w-full'>
                  <div className='flex items-center gap-3 mb-1'>
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/url/${url.shortCode}`}
                      target='_blank'
                      rel="noopener noreferrer"
                      className='text-blue-400 hover:text-blue-300 font-semibold text-lg tracking-wide flex items-center gap-1 group-hover:underline decoration-blue-500/30 underline-offset-4'
                      onClick={() => handleLinkClick(url.shortCode)}
                    >
                      `{import.meta.env.VITE_BACKEND_URL}/url/{url.shortCode}`
                      <span className='opacity-0 group-hover:opacity-100 transition-opacity text-xs'>↗</span>
                    </a>
                  </div>
                  {/* Truncated original URL */}
                  <p className='text-sm text-gray-500 truncate w-full max-w-md lg:max-w-lg' title={url.originalUrl}>
                    {url.originalUrl}
                  </p>
                </div>

                {/* Right Side: Actions & Stats */}
                <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-gray-800 md:border-none pt-4 md:pt-0'>

                  {/* Clicks Badge */}
                  <div className='flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-lg'>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span className='text-sm font-medium text-gray-300'>{url.clicks} <span className='text-gray-500 font-normal hidden sm:inline'>clicks</span></span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    className='flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors'
                    title="Copy short link"
                  >
                    {copied === url.shortCode ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}


                  </button>
                  <button className='flex items-center justify-center w-10 h-10 bg-red-600/20 hover:bg-red-600 text-red-400 rounded-lg transition-colors' onClick={() => { handleDelete }}>
                    🗑
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

