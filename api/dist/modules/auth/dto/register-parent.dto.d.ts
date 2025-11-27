import { CreateChildDto } from '../../children/dto/child.dto';
export declare class RegisterParentDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
    children?: CreateChildDto[];
}
