import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

function Layout() {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <h1 className={styles.title}>QuestionPro Frontend Assessment</h1>
        <nav className={styles.nav}>
          <NavLink
            to="/todos"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Todo List
          </NavLink>
          <NavLink
            to="/form-builder"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Form Builder
          </NavLink>
          <NavLink
            to="/form-preview"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Form Preview
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
