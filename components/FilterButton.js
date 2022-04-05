import styles from "../styles/FilterButton.module.css";

export default function FilterButton({title, onClick}) {

    return (
        <button className={styles.button} onClick={onClick}>
            {title}
        </button>
    )

}