import { useState, useEffect } from "react";
import CocktailCard from "../components/CocktailCard";
import styles from "../styles/Bar.module.css";
import { db } from "../src/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import nookies from "nookies";
import { useAuth } from "../components/AuthProvider";
import Link from "next/link";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdNoDrinks } from "react-icons/md";
import FilterButton from "../components/FilterButton";

const messages = {
    myFavourites: "You haven't favourited any drinks yet!"
}

export default function Bar() {

    const [ cocktails, setCocktails ] = useState([]);
    const [ filterSection, setFilterSection ] = useState("myCocktails");
    const user = useAuth();

    useEffect(() => {

        const fetchData = async () => {

            const q = query(collection(db, "cocktails"), where("creatorUid", "==", user.uid));
            const querySnapshot = await getDocs(q);
    
            const cocktails = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                
                const a = Math.min(data.ingredients.length, data.measures.length);
                // const recipe = [];
                // for(let i = 0; i < a; i ++) 
                //     recipe.push({ ingredient: data.ingredients[i], measure: data.measures[i] });
                
                cocktails.push({...data});

            });

            setCocktails(cocktails);
        }

        if(user) fetchData();
    }, [user]);

    return (
        <main>
            <h6>the</h6>
            <h1>mixology lab</h1>

            <p>Welcome to your very own mixology lab. Create, explore, and share with friends.</p>
            {cocktails.length == 0 && <p className={styles.hint}>Click the plus icon below to add your first recipe.</p>}

            <FilterButton title={"My Cocktails"} onClick={() => setFilterSection("myCocktails")}/>
            <FilterButton title={"My Favourites"} onClick={() => setFilterSection("myFavourites")}/>

            <div className={styles.grid}>

                {
                    filterSection === "myFavourites" &&
                    <div className={styles.noDrinksContainer}>
                        <MdNoDrinks className={styles.noDrinksIcon} />
                        <p className={styles.noDrinksMessage}>{messages[filterSection]}</p>
                    </div>
                }

                { 
                    filterSection === "myCocktails" &&
                    <>
                        <Link href="create">
                            <a>
                                <div className={styles.card}>
                                    <AiOutlinePlusCircle className={styles.icon}/>
                                </div>
                            </a>
                        </Link>
                        {cocktails && cocktails.map((cocktail, index) => <CocktailCard key={index} name={cocktail.name} lore={cocktail.lore} ingredients={cocktail.ingredients}/>)}
                    </>
                }

            </div>
        </main>
    )
}

/*
export async function getServerSideProps(context) {

    try {
        const cookies = nookies.get(context);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        
        const { uid, email } = token;

        const q = query(collection(db, "recipes"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        const recipes = querySnapshot.map((doc) => {
            return { id: doc.id, data: doc.data() }
        })

        return {
            props: {
                recipes
            }
        }
    } catch(error) {

        console.log(error);
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
}*/