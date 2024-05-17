import {Prisma, PrismaClient} from "@prisma/client";
import {BasicSchemaInformation} from "@backend/modules/Schema";
import {symbol} from "prop-types";
import {TapLevels} from "@backend/api/login/handler";

declare const global : {
  instance: PrismaClient
}

const instance: PrismaClient = global?.instance ?? new PrismaClient();
global.instance = instance;

function prop<T>(value: T) {
  return {
      needs: {},
      compute: ()=>value
  }
}

const prisma = instance.$extends({
  result: {
    user: {
      maxTapLvl: prop(TapLevels.length),
      maxEnergy: prop(10000),
      lvlInfo: {
        needs: {
          tapLvl: true
        },
        compute({tapLvl}) {
          return TapLevels[tapLvl - 1]
        }
      },
      energy: {
        needs: {
          energy: true,
          lastTap: true,
          energyLvl:true
        },
        compute({energy, lastTap, energyLvl}) {
          const seconds = ((new Date().getTime()) - lastTap.getTime()) / 1000;
          return Math.round(Math.min(10000, energy + (seconds * energyLvl)));
        }
      }
    }
  },
  model: {
    $allModels: {
      async by<T>(this: T, key: string, value: string): Promise<T> {
        const context = Prisma.getExtensionContext(this) as any;
        return context.findFirst({where: {[key]: value}});
      }
    }
  },
});




export function PrismaDefinitions() {
  return BasicSchemaInformation;
}


export default prisma;
