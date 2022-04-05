import { NativeSelect, TextInput, ActionIcon, Trash, Text, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import styles from "../styles/Create.module.css";
import { BiTrash } from "react-icons/bi";
import CocktailCard from "../components/CocktailCard.js";
import { useScrollIntoView } from "@mantine/hooks";
import { useAuth } from "../components/AuthProvider";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "../src/firebase";
import { formConfig } from "../src/createForm";
import { useState, useEffect } from "react";
import { useModals } from "@mantine/modals";
import { editCocktail } from "../src/cocktailCrud";

export default function Create() {

    const { scrollIntoView, refTarget } = useScrollIntoView();
    const [existingCocktails, setExistingCocktails] = useState([]);
    const user = useAuth();
    const form = useForm(formConfig);
    const modals = useModals();

    const confirmOverwriteModal = (callbk) => modals.openConfirmModal({
        title: "Please confirm overwrite",
        children: (<p>You already have a cocktail with the same name. Would you like to overwrite the existing cocktail?</p>),
        labels: { confirm: "Yes", cancel: "Cancel" },
        onCancel: () => callbk(false),
        onConfirm: () => callbk(true)
    });

    useEffect(() => {

        if (!user) return;

        const fetchData = async () => {
            const q = query(collection(db, "cocktails"), where("creatorUid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const cocktails = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                cocktails.push({ id: doc.id, name: data.name });
            });

            setExistingCocktails(cocktails);
        }

        fetchData();
    }, [user]);

    const onSubmit = async (event) => {

        event.preventDefault();
        const result = form.validate();

        if (result.hasErrors) {
            scrollIntoView({ alignment: "top" });
            return;
        }

        // submit form values to firestore
        if (user) {

            // extract data from form values into object for db
            const data = {
                name: form.values.name,
                lore: form.values.lore,
                ingredients: form.values.ingredients.map(val => val.ingredient),
                measures: form.values.ingredients.map(val => val.measure),
                instructions: form.values.instructions,
                glass: form.values.glass,
                creatorUid: user.uid,
                createdAt: serverTimestamp()
            }

            // existing cocktail with same name
            const clash = existingCocktails.filter(val => val.name.replace(" ", "").toLowerCase() == form.values.name.replace(" ", "").toLowerCase());
            if(clash.length > 0) {
                confirmOverwriteModal((confirmed) => {
                    if(confirmed) editCocktail(clash[0].id, data);
                    else form.setFieldError("name", "You already have a cocktail with this name");
                });
            } else {
                createCocktail(data);
            }
        }
    }

    const ingredientFields = form.values.ingredients.map((_, index) => (
        <Group key={index} mt="xs">
            <TextInput
                placeholder="handful of"
                required
                {...form.getListInputProps("ingredients", index, "measure")}
            />

            <TextInput
                placeholder="mint"
                required
                {...form.getListInputProps("ingredients", index, "ingredient")}
            />

            <ActionIcon
                color="red"
                variant="hover"
                onClick={() => form.removeListItem("ingredients", index)}
            >
                <BiTrash />
            </ActionIcon>
        </Group>
    ));

    const instructionFields = form.values.instructions.map((_, index) => (
        <Group key={index} mt="xs">
            <TextInput
                placeholder="white rum"
                required
                {...form.getListInputProps("instructions", index, "instruction")}
            />

            <ActionIcon
                color="red"
                variant="hover"
                onClick={() => form.removeListItem("instructions", index)}
            >
                <BiTrash />
            </ActionIcon>
        </Group>
    ));

    return (
        <div className={styles.container}>
            <form onSubmit={onSubmit} ref={refTarget}>

                <TextInput required label="Name" {...form.getInputProps("name")} />
                <TextInput required label="Lore" {...form.getInputProps("lore")} />
                <NativeSelect
                    data={["any", "high ball", "short", "hurricane", "martini", "coupe", "sling", "flute"]}
                    label="Glass type"
                    value={form.values.glass}
                    onChange={(event) => form.setFieldValue("glass", event.currentTarget.value)}
                />

                <Group mb="xs">
                    <Text weight={500} size="sm" pr={90}>
                        Measure
                    </Text>
                    <Text weight={500} size="sm" sx={{ flex: 1 }}>
                        Ingredient
                    </Text>
                </Group>

                {ingredientFields.length == 0 &&
                    <Text color="dimmed" align="center">
                        No ingredients? A very simple cocktail...
                    </Text>
                }

                {ingredientFields}

                <Group position="center" mt="md">
                    <Button onClick={() => form.addListItem("ingredients", { ingredient: "", measure: "" })}>
                        Add ingredient
                    </Button>
                </Group>

                <Group mb="xs">
                    <Text weight={500} size="sm" sx={{ flex: 1 }}>
                        Instruction
                    </Text>
                </Group>

                {instructionFields.length == 0 &&
                    <Text color="dimmed" align="center">
                        {"No instructions? I hope you know what you're doing..."}
                    </Text>
                }

                {instructionFields}

                <Group position="center" mt="md">
                    <Button onClick={() => form.addListItem("instructions", { instruction: "" })}>
                        Add instruction
                    </Button>
                </Group>

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>

                <CocktailCard name={form.values.name} lore={form.values.lore} ingredients={form.values.ingredients.map(value => value.ingredient)} />

            </form>
        </div>
    )

}