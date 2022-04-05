import styles from "../styles/CocktailCard.module.css";

export default function CocktailCard(props) {

    /*
        {
            name: "Mojito",
            recipe: [
                {
                    ingredient: "white rum",
                    measure: "50ml"
                }
            ]
        }
    */


    return (
        <div className={styles.card}>
            <h4 className={styles.title}>{props.name}</h4>
            <ul className={styles.ingredientsList}>
                {props.ingredients.map((ingredient, index) => 
                    <li key={index} className={styles.ingredient}>{ingredient}</li>
                )}
            </ul>
            <p className={styles.lore}>{props.lore}</p>
        </div>
    )

}