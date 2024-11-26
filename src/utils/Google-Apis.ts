import { Data, ListFiles } from "@/utils/Interfaces";
import { auth } from "@root/sheets.config"
import { google } from "googleapis";


const iam = google.iam('v1');

// get any service account key
type ServiceAccountPrivateKeyType = 'TYPE_GOOGLE_CREDENTIALS_FILE' | 'TYPE_PKCS12_FILE' | 'TYPE_UNSPECIFIED'

/**
 * this is the function to create the key of service account
 * @ServiceAccountPrivateKeyType 'TYPE_GOOGLE_CREDENTIALS_FILE' | 'TYPE_PKCS12_FILE' | 'TYPE_UNSPECIFIED'
 * @ServiceAccountKeyAlgorithm 'KEY_ALG_UNSPECIFIED' | 'KEY_ALG_RSA_1024' | 'KEY_ALG_RSA_2048'
 * @ref https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys/create
 * @param serviceAccountId take the unique id of the service account 
 * @returns it return error credentials like private key etc 
 */
export const createServiceAccountKey = async (serviceAccountId: string) => {
    type ServiceAccountPrivateKeyType = 'TYPE_GOOGLE_CREDENTIALS_FILE' | 'TYPE_PKCS12_FILE' | 'TYPE_UNSPECIFIED'
    type ServiceAccountKeyAlgorithm = 'KEY_ALG_UNSPECIFIED' | 'KEY_ALG_RSA_1024' | 'KEY_ALG_RSA_2048'
    try {
        const { data: credentials } = await iam.projects.serviceAccounts.keys.create({
            name: `projects/copycodecommunity/serviceAccounts/${serviceAccountId}@copycodecommunity.iam.gserviceaccount.com`,
            requestBody: {
                privateKeyType: 'TYPE_GOOGLE_CREDENTIALS_FILE' as ServiceAccountPrivateKeyType, // Specify the type of key
            },
            auth: await auth([
                'https://www.googleapis.com/auth/cloud-platform',
                'https://www.googleapis.com/auth/iam'
            ]),
        })
        return credentials
    } catch (error) {
        console.log('Error to create the key for service account' + (error as Data).message)
    }
}


/**
 * this is function toh list all the key running in the service account 
 * @ref https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys/list
 * @param service take unique id of the service account
 * @returns return the list of key available 
 */
export const getListOfKeys = async (service: string) => {
    try {
        const { data: list } = await iam.projects.serviceAccounts.keys.list({
            name: `projects/copycodecommunity/serviceAccounts/${service}@copycodecommunity.iam.gserviceaccount.com`,
            keyTypes: ['USER_MANAGED'],
            auth: await auth([
                'https://www.googleapis.com/auth/cloud-platform',
                'https://www.googleapis.com/auth/iam'
            ]),
        })
        return list.keys
    } catch (error) {
        console.log('error in listing the key ' + (error as Data).message)
        return

    }
}


/**
 * this is the function toh get the public key of any service account
 * @ref https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys/get
 * @param name it take the name of the listed in the list key. it includes the [uniqueid-service]@[project-name]/keys/[keyid] 
 * @returns it return the public key of respected service account
 */
export const getSpecificKey = async (name: string) => {
    try {
        console.log(name)
        const { data } = await iam.projects.serviceAccounts.keys.get({
            name: name as string,
            publicKeyType: 'TYPE_X509_PEM_FILE',
            auth: await auth([
                'https://www.googleapis.com/auth/cloud-platform',
                'https://www.googleapis.com/auth/iam'
            ]),
        })
        return data;
    } catch (error) {
        console.log('error in getting  the key ' + (error as Data).message)
        return

    }
}

/**
 * this is the function to get the storage information of the drive of the current service account
 * @ref https://developers.google.com/drive/api/reference/rest/v3/about/get?apix_params=%7B%22fields%22%3A%22storageQuota%22%7D
 * @fields_of_storage storageQuota
 * @param cred takes the object of the credentials for authentication
 * @returns the data with contain the information of the current service account or null when any error occurs
 */
export const getDriveStorage = async (cred: object) => {
    try {
        const drive = google.drive({
            version: "v3",
            auth: await auth([
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.appdata",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/drive.meet.readonly",
                "https://www.googleapis.com/auth/drive.metadata",
                "https://www.googleapis.com/auth/drive.metadata.readonly",
                "https://www.googleapis.com/auth/drive.photos.readonly",
                "https://www.googleapis.com/auth/drive.readonly"
            ], {
                type: "service_account",
                private_key: `aspect private key`,
                client_email: `${'[unique-id]'}@[project-id].iam.gserviceaccount.com`,
                token_url: "https://oauth2.googleapis.com/token",
                universe_domain: "googleapis.com",
            }),
        })
        const { data } = await drive.about.get({
            fields: 'storageQuota'
        })
        return data
    } catch (error) {
        console.log('error in getting  the storage info of the drive ' + (error as Data).message)
        return

    }
}


/**
 * this function is for creating the serviceAccount
 * @ref https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts/create
 * @returns it returns the create service account details
 */
export const createServiceAccount = async () => {
    const iam = google.iam('v1');
    try {
        const { data } = await iam.projects.serviceAccounts.create({
            // The resource name of the project in which to create the service account.
            name: `projects/copycodecommunity`,
            requestBody: {
                accountId: 'sahilkhan282',
                serviceAccount: {
                    displayName: 'Sahil khan',
                },
            },
            auth: await auth([
                'https://www.googleapis.com/auth/cloud-platform'
            ]),
        });
        console.log(`Service account created: ${data?.email}`);
        return data
    } catch (error) {
        console.error('Error creating service account:', (error as Data).message);
    }
}

/**
 * this is the function toh get the max limit of the service account will created in a project
 * @ref https://cloud.google.com/service-usage/docs/reference/rest/v1/services
 * @returns it return the number of the maximum limit of the service account create in a project
 */
const LimitOfServiceAccount = async () => {
    const service = {
        iam: 'iam.googleapis.com', // for service account and other qoute and limit
        service: 'serviceusage.googleapis.com',
        compute: 'compute.googleapis.com',
        cloudresourcemanager: 'cloudresourcemanager.googleapis.com' // for project related limit
    }
    const service_usage = google.serviceusage('v1');
    try {
        const projectId = 'copycodecommunity'
        const { data } = await service_usage.services.get({
            name: `projects/${projectId}/services/${service.cloudresourcemanager}`,
            auth: await auth([
                'https://www.googleapis.com/auth/cloud-platform',
                'https://www.googleapis.com/auth/cloud-platform.read-only'
            ]),
        })
        // console.log((data).config?.quota?.limits?.filter(limit => limit.name==='ServiceAccountsPerProject')[0].values?.DEFAULT)
        return data
    } catch (error) {
        console.log("Error from the Limit of the service Account :: " + (error as Data).message)
    }
}

/**
 * this is the function to list all the service Account in project
 * @ref https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts/list
 * @returns list of the service account
 */
export const ListServiceAccount = async () => {
    const iam = google.iam('v1');
    try {
        const { data } = await iam.projects.serviceAccounts.list({
            auth: await auth([
                'https://www.googleapis.com/auth/cloud-platform'
            ]),
            name: 'projects/copycodecommunity'
        });
        return data
    } catch (error) {
        console.log(`Error in creating Service account : ${(error as Data).message}`);
        return
    }
}

/**
 * This is the function to get all the posts in the current drive
 * @ref https://developers.google.com/drive/api/reference/rest/v3
 * @param data the data take an object of the some value like query of the data, projectid and service id
 * @returns it returns the json file to the api and if there is any error the nothing is return 
 */
export const listFiles = async (data: {
    query?: ListFiles,
    projectId?: string;
    serviceAccount?: string
}) => {
    const { query } = data as ListFiles;
    // console.log(query)
    try {
        const drive = google.drive({
            version: "v3",
            auth: await auth([
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.appdata",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/drive.meet.readonly",
                "https://www.googleapis.com/auth/drive.metadata",
                "https://www.googleapis.com/auth/drive.metadata.readonly",
                "https://www.googleapis.com/auth/drive.photos.readonly",
                "https://www.googleapis.com/auth/drive.readonly"
            ]),
        });
        /**
         * @ref https://developers.google.com/drive/api/guides/search-files
         */
        const { data } = await drive.files.list({
            q: query?.fileType || query?.filter ?
                [
                    query?.filter ? `name='${query.filter}'` : '',
                    query?.fileType === 'folder' ? `mimeType='application/vnd.google-apps.folder'` : ''
                ].filter(Boolean).join(' and ')
                : undefined,
            fields: "files(id, name, mimeType, thumbnailLink, webViewLink,parents)",
        });
        const { data: driveStorage } = await drive.about.get({
            fields: 'storageQuota'
        })
        return {
            ...data,
            driveStorage
        };
    } catch (error) {
        console.log(`Error is list the post from the drive :: ${(error as Data).message}`)
        return false
    }
}