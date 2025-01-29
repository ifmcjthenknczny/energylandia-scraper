import dotenv from 'dotenv'
import { fromIni } from '@aws-sdk/credential-providers'

dotenv.config()

export const AWS_PROFILE = process.env.AWS_PROFILE
export const AWS_REGION = 'eu-central-1'
export const SECRETS_NAME = 'Secrets_of_Energylandia'

export const WAITING_TIME_URL =
    'https://www.kierunekzator.pl/wp-admin/admin-ajax.php'
export const WAITING_TIME_REQUEST_BODY =
    'action=wpda_datatables&wpnonce=7c4595a35f&pubid=1&filter_field_name=&filter_field_value=&nl2br='

export const OPENING_HOURS_URL =
    'https://energylandia.pl/wp-admin/admin-ajax.php?action=get_calendar_json&language=pl'

export const AWS_CREDENTIALS_CONFIG = {
    region: AWS_REGION,
    credentials: AWS_PROFILE ? fromIni({ profile: AWS_PROFILE }) : undefined,
}
