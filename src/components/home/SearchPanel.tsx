import { getNeighbourhoods } from "@/content/data";
import { Icon } from "../Icon/Icon";
import styles from "./home.module.css";

/*
  Home search. A plain GET form to /homes, so it works without JavaScript
  and the results page can read the choices from the address bar.
*/
export async function SearchPanel() {
  const neighbourhoods = await getNeighbourhoods();
  return (
    <form className={styles.search} action="/homes" method="get" role="search" aria-label="Find a home">
      <fieldset className={styles.tabs}>
        <legend className="visually-hidden">Looking to</legend>
        {[
          ["sale", "Buy"],
          ["rent", "Rent"],
          ["sold", "Sold"],
        ].map(([value, label], i) => (
          <label key={value} className={styles.tab}>
            <input type="radio" name="status" value={value} defaultChecked={i === 0} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Location</span>
          <select name="area" defaultValue="">
            <option value="">Any neighbourhood</option>
            {neighbourhoods.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={18} className={styles.chevron} />
        </label>

        <label className={`${styles.field} ${styles.wideOnly}`}>
          <span className={styles.fieldLabel}>Property type</span>
          <select name="type" defaultValue="">
            <option value="">Any type</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <Icon name="chevron" size={18} className={styles.chevron} />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Price</span>
          <select name="max" defaultValue="">
            <option value="">Any price</option>
            <option value="500000">Up to $500,000</option>
            <option value="750000">Up to $750,000</option>
            <option value="1000000">Up to $1,000,000</option>
            <option value="1500000">Up to $1,500,000</option>
          </select>
          <Icon name="chevron" size={18} className={styles.chevron} />
        </label>

        <label className={`${styles.field} ${styles.wideOnly}`}>
          <span className={styles.fieldLabel}>Bedrooms</span>
          <select name="beds" defaultValue="">
            <option value="">Any</option>
            <option value="1">1 or more</option>
            <option value="2">2 or more</option>
            <option value="3">3 or more</option>
            <option value="4">4 or more</option>
          </select>
          <Icon name="chevron" size={18} className={styles.chevron} />
        </label>

        <button type="submit" className={styles.searchButton}>
          <Icon name="search" size={18} />
          Search
        </button>
      </div>
    </form>
  );
}
