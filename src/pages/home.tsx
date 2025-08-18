import { Link } from 'react-router'

export function Home() {
  return (
    <ul className="list-inside list-disc space-y-2 py-2 pl-4">
      <li>
        <Link
          to="/hello"
          className="text-blue-600 underline hover:text-blue-800"
        >
          hello
        </Link>
      </li>
      <li>
        Node
        <ul className="list-inside list-disc space-y-2 py-2 pl-4">
          <li>
            <Link
              to="/node/type"
              className="text-blue-600 underline hover:text-blue-800"
            >
              type
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  )
}

export default Home
