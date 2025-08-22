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
        <Link
          to="/controls"
          className="text-blue-600 underline hover:text-blue-800"
        >
          controls
        </Link>
      </li>
      <li>
        <Link
          to="/panel"
          className="text-blue-600 underline hover:text-blue-800"
        >
          panel
        </Link>
      </li>
      <li>
        Background
        <ul className="list-inside list-disc space-y-2 py-2 pl-4">
          <li>
            <Link
              to="/background/cross"
              className="text-blue-600 underline hover:text-blue-800"
            >
              cross
            </Link>
          </li>
          <li>
            <Link
              to="/background/dots"
              className="text-blue-600 underline hover:text-blue-800"
            >
              dots
            </Link>
          </li>
          <li>
            <Link
              to="/background/lines"
              className="text-blue-600 underline hover:text-blue-800"
            >
              lines
            </Link>
          </li>
        </ul>
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
          <li>
            <Link
              to="/node/rect"
              className="text-blue-600 underline hover:text-blue-800"
            >
              rect
            </Link>
          </li>
          <li>
            <Link
              to="/node/ellipse"
              className="text-blue-600 underline hover:text-blue-800"
            >
              ellipse
            </Link>
          </li>
          <li>
            <Link
              to="/node/path"
              className="text-blue-600 underline hover:text-blue-800"
            >
              path
            </Link>
          </li>
          <li>
            <Link
              to="/node/text"
              className="text-blue-600 underline hover:text-blue-800"
            >
              text
            </Link>
          </li>
          <li>
            <Link
              to="/node/flow"
              className="text-blue-600 underline hover:text-blue-800"
            >
              flow
            </Link>
          </li>
          <li>
            <Link
              to="/node/group"
              className="text-blue-600 underline hover:text-blue-800"
            >
              group
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  )
}

export default Home
