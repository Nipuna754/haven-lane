import { Button } from "../Button/Button";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <main id="main" className={`container ${styles.page}`}>
      <p className={styles.code}>Page not found</p>
      <h1>This home isn’t on our books</h1>
      <p className={styles.text}>The listing may have sold or the link may be mistyped. Try the full list of homes instead.</p>
      <div className={styles.actions}>
        <Button href="/homes">See all homes</Button>
        <Button href="/" variant="secondary">
          Back to the home page
        </Button>
      </div>
    </main>
  );
}
