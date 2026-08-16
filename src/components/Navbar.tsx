import { Link } from 'react-router-dom';
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">StudyVerse</div>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/ai-tutor">AI Tutor</Link></li>
                <li><Link to="/dsa-workspace">DSA Workspace</Link></li>
                <li><Link to="/quiz-practice">Quiz Practice</Link></li>
            </ul>

            <Link to="/dsa-workspace" className="start-btn">
                Open Workspace
            </Link>
        </nav>
    );
}

export default Navbar;