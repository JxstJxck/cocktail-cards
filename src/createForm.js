import { formList } from "@mantine/form";

const MAX_NAME_LENGTH = 64, MAX_LORE_LENGTH = 256,
    MAX_INGREDIENT_LENGTH = 64, MAX_MEASURE_LENGTH = 64,
    MAX_INSTRUCTION_LENGTH = 256;

const validateName = (value) => {
    if (value.length == 0) return "Name cannot be empty";
    if (value.length > MAX_NAME_LENGTH) return `Name cannot be more than ${MAX_NAME_LENGTH} characters`;
    return null;
}

const validateLore = (value) => {
    if (value.length == 0) return "Lore cannot be empty";
    if (value.length > MAX_LORE_LENGTH) return `Lore cannot be more than ${MAX_LORE_LENGTH} characters`;
    return null;
}

const validateIngredients = () => {
    const validateIngredient = (value) => {
        if (value.length == 0) return "Ingredient cannot be empty";
        if (value.length > MAX_INGREDIENT_LENGTH) return `Ingredient cannot be more than ${MAX_INGREDIENT_LENGTH} characters`;
        return null;
    }

    const validateMeasure = (value) => {
        if (value.length == 0) return "Measure cannot be empty";
        if (value.length > MAX_MEASURE_LENGTH) return `Ingredient cannot be more than ${MAX_MEASURE_LENGTH} characters`;
        return null;
    }

    return {
        ingredient: validateIngredient,
        measure: validateMeasure
    }
}

const validateInstructions = () => {
    const validateInstruction = (value) => {
        if (value.length == 0) return "The instruction cannot be empty";
        if (value.length > MAX_INSTRUCTION_LENGTH) return `Instruction cannot be more than ${MAX_INSTRUCTION_LENGTH} characters`;
        return null;
    }

    return {
        instruction: validateInstruction
    }
}

const formConfig = {
    initialValues: {
        name: "",
        lore: "",
        glass: "any",
        ingredients: formList([{ ingredient: "", measure: "" }]),
        instructions: formList([{ instruction: "" }])
    },

    validate: {
        name: validateName,
        lore: validateLore,
        ingredients: validateIngredients,
        instructions: validateInstructions
    }
};

export { formConfig };