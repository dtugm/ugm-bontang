import {
  LandType,
  STAWPOP,
  TaxObjectCode_1,
  TaxObjectCode_2,
  WWCCode,
  TaxPayerCode,
} from "~/app/types/enums/landParcel";

export const staWpopMap: Record<string, STAWPOP> = {
  "1": STAWPOP.MENEMPATI,
  "2": STAWPOP.MENYEWAKAN,
  "3": STAWPOP.SEBAGAI_PEMILIK,
  "4": STAWPOP.TIDAK_JELAS,
};

export const jenisTanahMap: Record<string, LandType> = {
  "1": LandType.LAND_AND_BUILDING,
  "2": LandType.READY_TO_BUILD_PLOT,
  "3": LandType.EMPTY_LAND,
  "4": LandType.PUBLIC_FACILITY,
  "5": LandType.GOVERNMENT_LAND,
};

export const wwcMap: Record<string, WWCCode> = {
  "1": WWCCode.TAX_SUBJECT_MET,
  "2": WWCCode.TAX_SUBJECT_NOT_MET,
  "3": WWCCode.TAX_SUBJECT_REPRESENTATIVE,
};

export const wpMap: Record<string, TaxPayerCode> = {
  "1": TaxPayerCode.NO_CHANGES,
  "2": TaxPayerCode.TAX_PAYER_CHANGED,
  "3": TaxPayerCode.TAX_PAYER_CHANGED_GOVERNMENT_LAND,
  "4": TaxPayerCode.TAX_PAYER_CHANGED_PUBLIC_FACILITY,
  "5": TaxPayerCode.NEW,
  "6": TaxPayerCode.NO_INFORMATION,
};

export const op1Map: Record<string, TaxObjectCode_1> = {
  "1": TaxObjectCode_1.ACCURATE,
  "2": TaxObjectCode_1.CHANGED,
};

export const op2Map: Record<string, TaxObjectCode_2> = {
  "1": TaxObjectCode_2.NEW_TAX_OBJECT,
  "2": TaxObjectCode_2.MERGING_TAX_OBJECT,
  "3": TaxObjectCode_2.SPLITTING_TAX_OBJECT,
  "4": TaxObjectCode_2.REDELINIATION,
  "5": TaxObjectCode_2.CONFLICT,
};
