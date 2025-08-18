import { Link } from 'react-router'

export function Home() {
  return (
    <ul className="list-disc list-inside space-y-2 py-2 pl-4">
      <li>
        <Link
          to="/hello"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Hello 页面
        </Link>
      </li>
    </ul>
  )
}

export default Home
