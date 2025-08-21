import { CustomResource } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

interface DataSchemaMigrationsProps {
  dataSchemaMigrationFn: IFunction;
}

export class DataSchemaMigrations extends Construct {
  public readonly customResource: CustomResource;

  constructor(
    scope: Construct,
    id: string,
    { dataSchemaMigrationFn }: DataSchemaMigrationsProps
  ) {
    super(scope, id);

    // Custom Resource provider
    const provider = new Provider(this, "MigrationsProvider", {
      onEventHandler: dataSchemaMigrationFn,
      logRetention: RetentionDays.ONE_WEEK,
    });

    // The resource will re-run when the assets change
    this.customResource = new CustomResource(this, "RunMigrations", {
      serviceToken: provider.serviceToken,
      properties: {
        DeploymentTimestamp: Date.now(), // Ensures it runs on every deployment
      },
    });
  }
}
