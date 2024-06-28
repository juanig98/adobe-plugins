import { InDocument } from "./global";

export class ViewPreference {

    private readonly PIXELS = 2054187384;
    verticalToPixels(): void {
        InDocument.viewPreferences.verticalMeasurementUnits = this.PIXELS; // MeasurementUnits.PIXELS
    }
    horizontalToPixels(): void {
        InDocument.viewPreferences.horizontalMeasurementUnits = this.PIXELS; // MeasurementUnits.PIXELS
    }

    toPixels(): void {
        this.verticalToPixels();
        this.horizontalToPixels();
    }

    private readonly INCHES = 2053729891;
    verticalToInches(): void {
        InDocument.viewPreferences.verticalMeasurementUnits = this.INCHES; // MeasurementUnits.Inches
    }
    horizontalToInches(): void {
        InDocument.viewPreferences.horizontalMeasurementUnits = this.INCHES; // MeasurementUnits.Inches
    }

    toInches(): void {
        this.verticalToInches();
        this.horizontalToInches();
    }

    private readonly POINTS = 2054188905;
    verticalToPoints(): void {
        InDocument.viewPreferences.verticalMeasurementUnits = this.POINTS; // MeasurementUnits.POINTS
    }
    horizontalToPoints(): void {
        InDocument.viewPreferences.horizontalMeasurementUnits = this.POINTS; // MeasurementUnits.POINTS
    }

    toPoints(): void {
        this.verticalToPoints();
        this.horizontalToPoints();
    }
}