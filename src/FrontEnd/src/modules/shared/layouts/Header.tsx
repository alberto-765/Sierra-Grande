import styles from './Header.module.css'
import {} from 'react-icons/tb'

export const Header = () => {
  return (
    <header>
        <section className={styles.blackSection}>
            Seccion negra
        </section>
        <section>
            Barra
        </section>
    </header>
  )
}
