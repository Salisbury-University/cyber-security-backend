import { PrismaClient } from '@prisma/client';
import { AuthService } from './AuthService';
import NotFoundException from '../exceptions/NotFoundException';
const prisma = new PrismaClient();

export const ExericseService = {


async findInfo(exercise_ID, token) {
    const exerciseInfo = await prisma.exercise.findFirst({
        where:{
            exercise_ID: exercise_ID,
            user: AuthService.decodeToken(token).uid 
        }
    })
    if(exerciseInfo == null)
			throw new NotFoundException()

    if(exerciseInfo.status == "complete") {

    }
    return exerciseInfo
    
}


}