import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
} from 'sequelize';

interface UserAttributes {
    id: number;
    email: string;
    password_hash: string;
    role: 'admin' | 'customer';
    is_active: boolean;
    email_verified_at: Date | null;
    last_login_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class User
    extends Model<InferAttributes<User>, InferCreationAttributes<User>>
    implements UserAttributes {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password_hash: string;
    declare role: 'admin' | 'customer';
    declare is_active: boolean;
    declare email_verified_at: Date | null;
    declare last_login_at: Date | null;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

export function initUserModel(sequelize: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('admin', 'customer'),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            email_verified_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            last_login_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'users',
            modelName: 'User',
            timestamps: false,
        }
    );
}
