import { PrismaClient } from '@prisma/client';
import marked from 'marked'
import NotFoundException from '../exceptions/NotFoundException';
const prisma = new PrismaClient();

export const ExericseService = {

async findInfo(exercise_ID, user) {
    const exerciseInfo = await prisma.exercise.findFirst({
        where:{
            exercise_ID: exercise_ID,
            user: user
        }
    })
    if(exerciseInfo == null) {
			throw new NotFoundException()
    }
    if(exerciseInfo.status == "complete") {

    }
    
    return exerciseInfo
    
},

}