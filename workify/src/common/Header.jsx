import './Header.css'

export default function Header() {

  return (
    <div className="navbar">
      <div className="logo">
        Workify
      </div>
      <ul className="nav-links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/jobs">Jobs</a>
        </li>
        <li>
          <a href="#">Applications</a>
        </li>
      </ul>
      <div className='nav-profile'>
        <a href='/profile'>Profile</a>
      </div>
    </div>
  );
}
