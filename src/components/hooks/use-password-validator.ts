import PasswordValidator from "password-validator";
import { useEffect, useState } from "react";

export default function usePasswordValidator(password: string) {
    const passwordSchema = new PasswordValidator().is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits().has().not().spaces().has().symbols();

    const [checks, setChecks] = useState<boolean | any[]>([])
    const [isValid, setIsValid] = useState<boolean | any[]>(false)

    useEffect(() => {
        setChecks(passwordSchema.validate(password, { list: true }))
        setIsValid(passwordSchema.validate(password))
    }, [password])

    return { checks, isValid }
}